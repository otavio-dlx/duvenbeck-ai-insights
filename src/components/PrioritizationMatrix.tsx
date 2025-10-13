import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { participantsData } from "@/data/participants";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LocalizableString, NewFormatIdea } from "@/data/types";
import { getIdeasFor, getLocalizedString, listDataKeys } from "@/lib/data";

type Row = {
  source: string;
  idee?: LocalizableString;
  finalPrio?: string | number;
  prioritaet?: string;
};

type DisplayRow = Row & { sourceDisplay: string };

export const PrioritizationMatrix: React.FC = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Row[]>([]);
  const [sortBy, setSortBy] = useState<keyof Row | "source">("finalPrio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedIdea, setSelectedIdea] = useState<{
    source: string;
    idee: string;
  } | null>(null);
  const [projectBrief, setProjectBrief] = useState<string>("");

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_+)|(_+$)/g, "");

  const handleIdeaClick = async (source: string, idee: string) => {
    setSelectedIdea({ source, idee });
    const data = await getIdeasFor(source);
    if (!data) return;

    // Check for new format first (structured ideas array)
    const newFormatIdeas = (data as { ideas?: NewFormatIdea[] }).ideas;
    if (Array.isArray(newFormatIdeas)) {
      const matchingIdea = newFormatIdeas.find((idea) => idea.ideaKey === idee);

      if (matchingIdea) {
        // Use translation keys to get localized content
        const formattedSections = [
          {
            title: t("matrix.sections.problem"),
            content: getLocalizedString(matchingIdea.problemKey),
          },
          {
            title: t("matrix.sections.solution"),
            content: getLocalizedString(matchingIdea.solutionKey),
          },
        ];

        // Add complexity note if available
        if (matchingIdea.complexityNoteKey) {
          formattedSections.push({
            title: "Complexity Note",
            content: getLocalizedString(matchingIdea.complexityNoteKey),
          });
        }

        // Add cost note if available
        if (matchingIdea.costNoteKey) {
          formattedSections.push({
            title: "Cost Note",
            content: getLocalizedString(matchingIdea.costNoteKey),
          });
        }

        // Add ROI note (handle both legacy roiNote and new roiNoteKey)
        if (matchingIdea.roiNoteKey) {
          formattedSections.push({
            title: "ROI Note",
            content: getLocalizedString(matchingIdea.roiNoteKey),
          });
        } else if (matchingIdea.roiNote) {
          formattedSections.push({
            title: "ROI Note",
            content: matchingIdea.roiNote,
          });
        }

        // Add risk note if available
        if (matchingIdea.riskNoteKey) {
          formattedSections.push({
            title: "Risk Note",
            content: getLocalizedString(matchingIdea.riskNoteKey),
          });
        }

        // Add strategic note if available
        if (matchingIdea.strategicNoteKey) {
          formattedSections.push({
            title: "Strategic Note",
            content: getLocalizedString(matchingIdea.strategicNoteKey),
          });
        }

        setProjectBrief(JSON.stringify(formattedSections));
      }
    } else {
      // Placeholder for old format - we'll skip detailed project briefs for now
      const placeholderSections = [
        {
          title: "Information",
          content:
            "Project details are not available for this department yet. Please check back after the data migration is complete.",
        },
      ];
      setProjectBrief(JSON.stringify(placeholderSections));
    }
  };

  // Precompute participant names for fuzzy matching
  const participantNormalized = useMemo(
    () =>
      participantsData.map((p) => ({
        normalized: normalize(p.groupName || ""),
        display: p.groupName,
      })),
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const keys = await listDataKeys();
      const acc: Row[] = [];

      for (const k of keys) {
        const data = await getIdeasFor(k);
        if (!data) continue;

        // Check for new format (structured ideas array)
        const newFormatIdeas = (data as { ideas?: NewFormatIdea[] }).ideas;
        if (Array.isArray(newFormatIdeas)) {
          for (const idea of newFormatIdeas) {
            if (!idea.ideaKey) continue; // Skip invalid entries

            acc.push({
              source: k,
              idee: idea.ideaKey,
              finalPrio: idea.finalPrio || "",
              prioritaet: idea.priority || "",
            });
          }
          continue; // Skip old format processing for this department
        }

        // Fall back to old format (Priorisierungsmatrix) - simplified placeholder
        const maybeMatrix = (data as { [key: string]: unknown })[
          "Priorisierungsmatrix"
        ];
        if (Array.isArray(maybeMatrix)) {
          // For now, we'll show a placeholder for old format departments
          // This will encourage migration to the new format
          acc.push({
            source: k,
            idee: "Data migration needed for this department",
            finalPrio: "N/A",
            prioritaet: "N/A",
          });
        }
      }

      if (mounted) setRows(acc);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Attach display names
  const withDisplay = useMemo<DisplayRow[]>(() => {
    return rows.map((r) => {
      const keyNorm = normalize(r.source || "");
      let found = participantNormalized.find((p) => p.normalized === keyNorm);
      if (!found) {
        const tokens = keyNorm.split("_").filter(Boolean);
        found = participantNormalized.find((p) =>
          tokens.every((t) => p.normalized.includes(t))
        );
      }
      const display =
        found?.display ||
        r.source
          .replace(/_/g, " ")
          .replace(/(^|\s)\S/g, (s) => s.toUpperCase());
      return { ...r, sourceDisplay: display };
    });
  }, [rows, participantNormalized]);

  // Sort rows by column
  const sorted = useMemo<DisplayRow[]>(() => {
    const copy = [...withDisplay];

    const getVal = (row: DisplayRow, key: keyof Row | "source") => {
      if (key === "source") return row.sourceDisplay || row.source || "";
      const v = row[key as keyof Row];
      return v == null ? "" : String(v);
    };

    copy.sort((a, b) => {
      const av = getVal(a, sortBy);
      const bv = getVal(b, sortBy);
      const aNum = parseFloat(av.replace(/,/g, "."));
      const bNum = parseFloat(bv.replace(/,/g, "."));

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum))
        return sortDir === "asc" ? aNum - bNum : bNum - aNum;

      const aStr = av.toLowerCase();
      const bStr = bv.toLowerCase();
      if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return copy;
  }, [withDisplay, sortBy, sortDir]);

  const header = (key: keyof Row | "source", label: string) => {
    const icon = sortBy === key ? (sortDir === "asc" ? "▲" : "▼") : "";
    return (
      <th
        className="p-2 text-left cursor-pointer select-none"
        onClick={() => {
          if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
          else {
            setSortBy(key);
            setSortDir("desc");
          }
        }}
      >
        {label} {icon}
      </th>
    );
  };

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {header("source", t("matrix.source"))}
              {header("idee", t("matrix.idea"))}
              {header("finalPrio", t("matrix.finalPrio"))}
              {header("prioritaet", t("matrix.priority"))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={4}>
                  {t("matrix.noRows")}
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr
                  key={`${r.source}-${
                    r.idee ? getLocalizedString(r.idee).slice(0, 30) : ""
                  }-${r.finalPrio}`}
                  className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() =>
                    r.idee &&
                    handleIdeaClick(r.source, getLocalizedString(r.idee))
                  }
                >
                  <td className="p-2">{r.sourceDisplay}</td>
                  <td className="p-2">
                    {r.idee ? getLocalizedString(r.idee) : ""}
                  </td>
                  <td className="p-2">{String(r.finalPrio)}</td>
                  <td className="p-2">{r.prioritaet}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={selectedIdea !== null}
        onOpenChange={() => setSelectedIdea(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">
              {selectedIdea?.idee}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
            {projectBrief &&
              JSON.parse(projectBrief).map(
                (
                  section: { title: string; content: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="py-4 first:pt-0 border-b last:border-b-0 border-border/50"
                  >
                    <h3 className="text-base font-semibold text-primary mb-2 flex items-center gap-2">
                      {section.title}
                    </h3>
                    <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                )
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
