import { participantsData } from "@/data/participants";
import { getIdeasFor, listDataKeys } from "@/lib/data";
import React, { useEffect, useMemo, useState } from "react";

type Row = {
  source: string;
  idee?: string;
  finalPrio?: string | number;
  gewichtetePunktzahl?: number | string;
  prioritaet?: string;
};

type DisplayRow = Row & { sourceDisplay: string };

export const PrioritizationMatrix: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [sortBy, setSortBy] = useState<keyof Row | "source">(
    "gewichtetePunktzahl"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_+)|(_+$)/g, "");

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

        const maybeMatrix = (data as any)["Priorisierungsmatrix"];
        if (!Array.isArray(maybeMatrix)) continue;

        for (const r of maybeMatrix as Array<Record<string, unknown>>) {
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

          const ideeRaw = stringifyValue(r["Idee"] ?? r["Unnamed: 0"] ?? "");
          if (!ideeRaw.trim()) continue;

          acc.push({
            source: k,
            idee: ideeRaw,
            finalPrio: stringifyValue(
              r["Final prio"] ?? r["Final Prios"] ?? ""
            ),
            gewichtetePunktzahl: stringifyValue(
              r["Gewichtete Punktzahl"] ?? ""
            ),
            prioritaet: stringifyValue(r["Priorität (A, B, C)"] ?? ""),
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
    <div className="overflow-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {header("source", "Source")}
            {header("idee", "Idee")}
            {header("finalPrio", "Final Prio")}
            {header("gewichtetePunktzahl", "Gewichtete Punktzahl")}
            {header("prioritaet", "Priorität")}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td className="p-2" colSpan={5}>
                No prioritization rows found.
              </td>
            </tr>
          ) : (
            sorted.map((r) => (
              <tr
                key={`${r.source}-${r.idee?.slice(0, 30)}-${r.finalPrio}`}
                className="border-t"
              >
                <td className="p-2">{r.sourceDisplay}</td>
                <td className="p-2">{r.idee}</td>
                <td className="p-2">{String(r.finalPrio)}</td>
                <td className="p-2">{String(r.gewichtetePunktzahl)}</td>
                <td className="p-2">{r.prioritaet}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
