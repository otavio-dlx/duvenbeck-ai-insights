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

// Define interfaces for modal section types
interface ModalStat {
  label: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "neutral";
}

interface ModalMetric {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  note?: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "neutral";
  description: string;
}

interface ModalItem {
  label: string;
  value: string;
  description?: string;
}

interface ModalSection {
  type:
    | "hero"
    | "quickStats"
    | "twoColumn"
    | "metricsGrid"
    | "summary"
    | "additionalInfo"
    | "placeholder";
  title?: string;
  subtitle?: string;
  priority?: string;
  finalPrio?: string | number;
  description?: string;
  stats?: ModalStat[];
  metrics?: ModalMetric[];
  items?: ModalItem[];
  leftSection?: {
    title: string;
    content: string;
    icon: string;
    bgColor: string;
  };
  rightSection?: {
    title: string;
    content: string;
    icon: string;
    bgColor: string;
  };
  content?: string;
  icon?: string;
}

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

  // Helper functions for color mappings
  const getPriorityColor = (priority: string): "green" | "yellow" | "red" => {
    if (priority === "A") return "green";
    if (priority === "B") return "yellow";
    return "red";
  };

  const getBorderColorClass = (color: string): string => {
    switch (color) {
      case "green":
        return "border-green-500";
      case "yellow":
        return "border-yellow-500";
      case "red":
        return "border-red-500";
      case "purple":
        return "border-purple-500";
      case "neutral":
        return "border-gray-300";
      default:
        return "border-blue-500";
    }
  };

  const getBackgroundColorClass = (color: string): string => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "red":
        return "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200";
      case "purple":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "neutral":
        return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getProgressBarColorClass = (color: string): string => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      case "purple":
        return "bg-purple-500";
      case "neutral":
        return "bg-gray-400";
      default:
        return "bg-blue-500";
    }
  };

  const getMetricLevelText = (value: number): string => {
    if (value > 3) return "High";
    if (value > 1) return "Medium";
    return "Low";
  };

  const getSortIcon = (key: keyof Row | "source"): string => {
    if (sortBy !== key) return "";
    return sortDir === "asc" ? "▲" : "▼";
  };

  const safeStringify = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    try {
      return JSON.stringify(value);
    } catch {
      return Object.prototype.toString.call(value);
    }
  };

  // Helper function to create new format modal sections
  const createNewFormatSections = (
    matchingIdea: NewFormatIdea
  ): ModalSection[] => {
    return [
      {
        type: "hero",
        title: getLocalizedString(matchingIdea.ideaKey),
        subtitle: getLocalizedString(matchingIdea.problemKey),
        priority: matchingIdea.priority,
        finalPrio: matchingIdea.finalPrio,
      },
      {
        type: "quickStats",
        title: t("modal.quickOverview"),
        stats: [
          {
            label: t("modal.owner"),
            value: matchingIdea.owner,
            icon: "",
            color: "blue",
          },
          {
            label: t("modal.priority"),
            value: matchingIdea.priority,
            icon: "",
            color: getPriorityColor(matchingIdea.priority),
          },
          {
            label: t("modal.finalPriority"),
            value: String(matchingIdea.finalPrio),
            icon: "",
            color: "red",
          },
        ],
      },
      {
        type: "twoColumn",
        leftSection: {
          title: t("matrix.sections.problem"),
          content: getLocalizedString(matchingIdea.problemKey),
          icon: "",
          bgColor: "red",
        },
        rightSection: {
          title: t("matrix.sections.solution"),
          content: getLocalizedString(matchingIdea.solutionKey),
          icon: "",
          bgColor: "neutral",
        },
      },
      {
        type: "metricsGrid",
        title: t("modal.projectMetrics"),
        description: t("modal.metricsDescription"),
        metrics: [
          {
            id: "complexity",
            label: t("modal.complexity"),
            value: matchingIdea.complexity,
            maxValue: 5,
            note: matchingIdea.complexityNoteKey
              ? getLocalizedString(matchingIdea.complexityNoteKey)
              : undefined,
            icon: "",
            color: "neutral",
            description: t("modal.complexityDesc"),
          },
          {
            id: "cost",
            label: t("modal.cost"),
            value: matchingIdea.cost,
            maxValue: 5,
            note: matchingIdea.costNoteKey
              ? getLocalizedString(matchingIdea.costNoteKey)
              : undefined,
            icon: "",
            color: "red",
            description: t("modal.costDesc"),
          },
          {
            id: "roi",
            label: t("modal.roi"),
            value: matchingIdea.roi,
            maxValue: 5,
            note: matchingIdea.roiNoteKey
              ? getLocalizedString(matchingIdea.roiNoteKey)
              : matchingIdea.roiNote,
            icon: "",
            color: "neutral",
            description: t("modal.roiDesc"),
          },
          {
            id: "risk",
            label: t("modal.risk"),
            value: matchingIdea.risk,
            maxValue: 5,
            note: matchingIdea.riskNoteKey
              ? getLocalizedString(matchingIdea.riskNoteKey)
              : undefined,
            icon: "",
            color: "red",
            description: t("modal.riskDesc"),
          },
          {
            id: "strategic",
            label: t("modal.strategicAlignment"),
            value: matchingIdea.strategicAlignment,
            maxValue: 5,
            note: matchingIdea.strategicNoteKey
              ? getLocalizedString(matchingIdea.strategicNoteKey)
              : undefined,
            icon: "",
            color: "neutral",
            description: t("modal.strategicDesc"),
          },
        ],
      },
      {
        type: "summary",
        title: t("modal.projectSummary"),
        items: [
          {
            label: t("modal.implementationComplexity"),
            value: `${matchingIdea.complexity}/5`,
            description: matchingIdea.complexityNoteKey
              ? getLocalizedString(matchingIdea.complexityNoteKey)
              : "No details available",
          },
          {
            label: t("modal.investmentLevel"),
            value: `${matchingIdea.cost}/5`,
            description: matchingIdea.costNoteKey
              ? getLocalizedString(matchingIdea.costNoteKey)
              : "No details available",
          },
          {
            label: t("modal.expectedReturn"),
            value: `${matchingIdea.roi}/5`,
            description: matchingIdea.roiNoteKey
              ? getLocalizedString(matchingIdea.roiNoteKey)
              : matchingIdea.roiNote || "No details available",
          },
        ],
      },
    ];
  };

  const handleIdeaClick = async (source: string, idee: string) => {
    console.log("handleIdeaClick called with:", { source, idee });
    setSelectedIdea({ source, idee });

    // The source is already the correct file key, no need for mapping
    console.log("Getting data for source:", source);
    const data = await getIdeasFor(source);
    console.log("Final data received:", data);
    if (!data) {
      console.log("No data returned for source:", source);
      return;
    }

    // Check for new format first (structured ideas array)
    const newFormatIdeas = (data as { ideas?: NewFormatIdea[] }).ideas;
    console.log("New format ideas:", newFormatIdeas);
    if (Array.isArray(newFormatIdeas)) {
      const matchingIdea = newFormatIdeas.find((idea) => idea.ideaKey === idee);

      if (matchingIdea) {
        // Use the updated createNewFormatSections function
        console.log("Found matching idea:", matchingIdea);
        const formattedSections = createNewFormatSections(matchingIdea);
        console.log("Generated sections:", formattedSections);

        setProjectBrief(JSON.stringify(formattedSections));
        console.log("ProjectBrief set:", JSON.stringify(formattedSections));
      } else {
        console.log("No matching idea found for:", idee);
      }
    } else {
      console.log("Not new format, checking old format...");
      // Handle old format (Priorisierungsmatrix)
      const maybeMatrix = (data as { [key: string]: unknown })[
        "Priorisierungsmatrix"
      ];

      if (Array.isArray(maybeMatrix)) {
        // Find the matching idea in the matrix
        const matchingRow = maybeMatrix.find((row: Record<string, unknown>) => {
          const rowIdee = row["Idee"] || row["Unnamed: 0"] || "";
          return normalize(safeStringify(rowIdee)) === normalize(idee);
        });

        if (matchingRow) {
          // Extract available data from the old format
          const problem = String(matchingRow["Problem"] || "");
          const solution = String(
            matchingRow["Lösung"] || matchingRow["Solution"] || ""
          );
          const owner = String(
            matchingRow["Ideenverantwortlicher"] || matchingRow["Owner"] || ""
          );
          const priority = String(
            matchingRow["Priorität (A, B, C)"] || matchingRow["Priority"] || ""
          );
          const finalPrio = String(
            matchingRow["Final prio"] || matchingRow["Final Prios"] || ""
          );

          // Extract numeric values (default to 0 if not available)
          const complexity = Number(
            matchingRow["Komplexität"] || matchingRow["Complexity"] || 0
          );
          const cost = Number(
            matchingRow["Kosten (€)"] || matchingRow["Cost"] || 0
          );
          const roi = Number(matchingRow["ROI"] || 0);
          const risk = Number(
            matchingRow["Risiko"] || matchingRow["Risk"] || 0
          );
          const strategicAlignment = Number(
            matchingRow["Strategische Ausrichtung"] ||
              matchingRow["Strategic Alignment"] ||
              0
          );

          // Extract explanation notes
          const complexityNote = String(matchingRow["Erläuterung"] || "");
          const costNote = String(matchingRow["Erläuterung.1"] || "");
          const roiNote = String(matchingRow["Erläuterung.2"] || "");
          const riskNote = String(matchingRow["Erläuterung.3"] || "");
          const strategicNote = String(matchingRow["Erläuterung.4"] || "");

          const formattedSections = [
            {
              type: "quickStats",
              title: t("modal.quickOverview"),
              stats: [
                ...(owner
                  ? [
                      {
                        label: t("modal.owner"),
                        value: owner,
                        icon: "👤",
                        color: "blue",
                      },
                    ]
                  : []),
                ...(priority
                  ? [
                      {
                        label: t("modal.priority"),
                        value: priority,
                        icon: "⭐",
                        color: getPriorityColor(priority),
                      },
                    ]
                  : []),
                ...(finalPrio
                  ? [
                      {
                        label: t("modal.finalPriority"),
                        value: finalPrio,
                        icon: "🎯",
                        color: "purple",
                      },
                    ]
                  : []),
              ],
            },
            ...(problem || solution
              ? [
                  {
                    type: "twoColumn",
                    leftSection: {
                      title: t("matrix.sections.problem"),
                      content: problem || t("modal.noDataAvailable"),
                      icon: "",
                      bgColor: "red",
                    },
                    rightSection: {
                      title: t("matrix.sections.solution"),
                      content: solution || t("modal.noDataAvailable"),
                      icon: "",
                      bgColor: "neutral",
                    },
                  },
                ]
              : []),
            // Only show metrics if we have any numeric values
            ...(complexity || cost || roi || risk || strategicAlignment
              ? [
                  {
                    type: "metricsGrid",
                    title: t("modal.projectMetrics"),
                    description: t("modal.metricsDescription"),
                    metrics: [
                      ...(complexity
                        ? [
                            {
                              id: "complexity",
                              label: t("modal.complexity"),
                              value: complexity,
                              maxValue: 5,
                              note: complexityNote || undefined,
                              icon: "🔧",
                              color: "blue",
                              description: t("modal.complexityDesc"),
                            },
                          ]
                        : []),
                      ...(cost
                        ? [
                            {
                              id: "cost",
                              label: t("modal.cost"),
                              value: cost,
                              maxValue: 5,
                              note: costNote || undefined,
                              icon: "💰",
                              color: "yellow",
                              description: t("modal.costDesc"),
                            },
                          ]
                        : []),
                      ...(roi
                        ? [
                            {
                              id: "roi",
                              label: t("modal.roi"),
                              value: roi,
                              maxValue: 5,
                              note: roiNote || undefined,
                              icon: "📈",
                              color: "green",
                              description: t("modal.roiDesc"),
                            },
                          ]
                        : []),
                      ...(risk
                        ? [
                            {
                              id: "risk",
                              label: t("modal.risk"),
                              value: risk,
                              maxValue: 5,
                              note: riskNote || undefined,
                              icon: "⚠️",
                              color: "red",
                              description: t("modal.riskDesc"),
                            },
                          ]
                        : []),
                      ...(strategicAlignment
                        ? [
                            {
                              id: "strategic",
                              label: t("modal.strategicAlignment"),
                              value: strategicAlignment,
                              maxValue: 5,
                              note: strategicNote || undefined,
                              icon: "🎯",
                              color: "purple",
                              description: t("modal.strategicDesc"),
                            },
                          ]
                        : []),
                    ],
                  },
                ]
              : []),
            // Additional information section for any extra fields
            {
              type: "additionalInfo",
              title: t("modal.additionalInformation"),
              items: Object.entries(matchingRow)
                .filter(
                  ([key, value]) =>
                    value &&
                    typeof value === "string" &&
                    value.trim() &&
                    ![
                      "Idee",
                      "Unnamed: 0",
                      "Problem",
                      "Lösung",
                      "Solution",
                      "Ideenverantwortlicher",
                      "Owner",
                      "Priorität (A, B, C)",
                      "Priority",
                      "Final prio",
                      "Final Prios",
                      "Komplexität",
                      "Complexity",
                      "Kosten (€)",
                      "Cost",
                      "ROI",
                      "Risiko",
                      "Risk",
                      "Strategische Ausrichtung",
                      "Strategic Alignment",
                      "Erläuterung",
                      "Erläuterung.1",
                      "Erläuterung.2",
                      "Erläuterung.3",
                      "Erläuterung.4",
                    ].includes(key) &&
                    !key.startsWith("Unnamed")
                )
                .map(([key, value]) => ({
                  label: key,
                  value: safeStringify(value),
                })),
            },
          ];

          setProjectBrief(
            JSON.stringify(
              formattedSections.filter((section) =>
                section.type === "additionalInfo"
                  ? section.items.length > 0
                  : true
              )
            )
          );
        } else {
          // Row not found in matrix
          const notFoundSections = [
            {
              type: "placeholder",
              title: t("modal.ideaNotFound"),
              content: t("modal.ideaNotFoundDesc"),
              icon: "🔍",
            },
          ];
          setProjectBrief(JSON.stringify(notFoundSections));
        }
      } else {
        // No matrix data available
        const placeholderSections = [
          {
            type: "placeholder",
            title: t("modal.dataNotAvailable"),
            content: t("modal.migrationNeeded"),
            icon: "⏳",
          },
        ];
        setProjectBrief(JSON.stringify(placeholderSections));
      }
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

        // Fall back to old format (Priorisierungsmatrix)
        const maybeMatrix = (data as { [key: string]: unknown })[
          "Priorisierungsmatrix"
        ];
        if (Array.isArray(maybeMatrix)) {
          // Parse each row in the matrix and create entries for actual ideas
          for (const row of maybeMatrix as Array<Record<string, unknown>>) {
            const stringifyValue = (v: unknown) => {
              if (v == null) return "";
              if (
                typeof v === "string" ||
                typeof v === "number" ||
                typeof v === "boolean"
              )
                return String(v);
              try {
                return JSON.stringify(v);
              } catch {
                return Object.prototype.toString.call(v);
              }
            };

            const ideaRaw = stringifyValue(
              row["Idee"] ?? row["Unnamed: 0"] ?? ""
            );
            // Skip empty ideas or those that are just headers
            if (!ideaRaw.trim() || ideaRaw === "Idee") continue;

            acc.push({
              source: k,
              idee: ideaRaw,
              finalPrio: stringifyValue(
                row["Final prio"] ?? row["Final Prios"] ?? ""
              ),
              prioritaet: stringifyValue(row["Priorität (A, B, C)"] ?? ""),
            });
          }
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
      return v == null ? "" : safeStringify(v);
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
    const icon = getSortIcon(key);
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
                    handleIdeaClick(
                      r.source,
                      typeof r.idee === "string"
                        ? r.idee
                        : JSON.stringify(r.idee)
                    )
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
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0 bg-white">
          <DialogHeader className="p-8 pb-6 border-b border-gray-200 bg-white">
            <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {selectedIdea?.idee ? getLocalizedString(selectedIdea.idee) : ""}
            </DialogTitle>
            {selectedIdea?.source && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 w-8 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">
                  {participantNormalized.find(
                    (p) => p.normalized === normalize(selectedIdea.source || "")
                  )?.display || selectedIdea.source}
                </span>
              </div>
            )}
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-8rem)] bg-gray-50">
            {projectBrief ? (
              JSON.parse(projectBrief).map(
                (section: ModalSection, sectionIndex: number) => (
                  <div
                    key={`section-${section.type}-${sectionIndex}`}
                    className={`${section.type !== "hero" ? "p-6" : ""} ${
                      section.type !== "hero" ? "border-b border-border/10" : ""
                    }`}
                  >
                    {/* Quick Stats Section */}
                    {section.type === "quickStats" && (
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {section.stats?.map(
                            (stat: ModalStat, idx: number) => (
                              <div
                                key={`stat-${stat.label}-${stat.value}-${idx}`}
                                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                              >
                                <div className="text-center">
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    {stat.label}
                                  </div>
                                  <div
                                    className={`text-2xl font-bold ${
                                      stat.color === "red"
                                        ? "text-red-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {stat.value}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Two Column Layout for Problem/Solution */}
                    {section.type === "twoColumn" && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg p-6 border-l-4 border-red-500 shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <h3 className="text-lg font-bold text-red-700">
                              {section.leftSection.title}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {section.leftSection.content}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 border-l-4 border-gray-300 shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                            <h3 className="text-lg font-bold text-gray-700">
                              {section.rightSection.title}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {section.rightSection.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Metrics Grid */}
                    {section.type === "metricsGrid" && (
                      <div className="mb-8">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900">
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {section.metrics?.map(
                            (metric: ModalMetric, idx: number) => (
                              <div
                                key={`metric-${metric.id}`}
                                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-lg text-gray-900">
                                      {metric.label}
                                    </h4>
                                    <div
                                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        metric.color === "red"
                                          ? "bg-red-50 text-red-700 border border-red-200"
                                          : "bg-gray-50 text-gray-700 border border-gray-200"
                                      }`}
                                    >
                                      {metric.value}/{metric.maxValue}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 leading-relaxed">
                                    {metric.description}
                                  </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                  <div className="flex gap-1 mb-3">
                                    {Array.from(
                                      { length: metric.maxValue },
                                      (_, i) => {
                                        const isActive = i < metric.value;
                                        const barColor = isActive
                                          ? "bg-red-500"
                                          : "bg-gray-200";

                                        return (
                                          <div
                                            key={i}
                                            className={`flex-1 h-2 rounded-full ${barColor}`}
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 text-center font-medium">
                                    {getMetricLevelText(metric.value)}
                                  </div>
                                </div>

                                {/* Note */}
                                {metric.note && (
                                  <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                      {metric.note}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Summary Section */}
                    {section.type === "summary" && (
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">
                          {section.title}
                        </h3>
                        <div className="space-y-4">
                          {section.items?.map(
                            (item: ModalItem, idx: number) => (
                              <div
                                key={`summary-${item.label}-${idx}`}
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                              >
                                <div className="flex-shrink-0 w-16 text-center">
                                  <div className="text-lg font-bold text-red-600">
                                    {item.value}
                                  </div>
                                  <div className="text-xs text-gray-500 font-medium">
                                    {item.label}
                                  </div>
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Information Section */}
                    {section.type === "additionalInfo" &&
                      section.items &&
                      section.items.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-6 text-gray-900">
                            {section.title}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.items?.map(
                              (item: ModalItem, idx: number) => (
                                <div
                                  key={`additional-${item.label}-${idx}`}
                                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                  <h4 className="font-semibold text-sm mb-2 text-gray-900">
                                    {item.label}
                                  </h4>
                                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {item.value}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Placeholder Section */}
                    {section.type === "placeholder" && (
                      <div className="flex items-start gap-4 p-6 bg-gray-50 border border-gray-200 rounded-lg mx-6">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold mb-2 text-gray-900">
                            {section.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <div className="p-6">
                <div className="text-center text-gray-500">
                  No data available for this idea.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
