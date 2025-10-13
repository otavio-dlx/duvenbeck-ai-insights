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
  color: "blue" | "green" | "yellow" | "red" | "purple";
}

interface ModalMetric {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  note?: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "red" | "purple";
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
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "purple":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
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
            icon: "👤",
            color: "blue",
          },
          {
            label: t("modal.priority"),
            value: matchingIdea.priority,
            icon: "⭐",
            color: getPriorityColor(matchingIdea.priority),
          },
          {
            label: t("modal.finalPriority"),
            value: String(matchingIdea.finalPrio),
            icon: "🎯",
            color: "purple",
          },
        ],
      },
      {
        type: "twoColumn",
        leftSection: {
          title: t("matrix.sections.problem"),
          content: getLocalizedString(matchingIdea.problemKey),
          icon: "🚫",
          bgColor: "red",
        },
        rightSection: {
          title: t("matrix.sections.solution"),
          content: getLocalizedString(matchingIdea.solutionKey),
          icon: "✨",
          bgColor: "green",
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
            icon: "🔧",
            color: "blue",
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
            icon: "💰",
            color: "yellow",
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
            icon: "📈",
            color: "green",
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
            icon: "⚠️",
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
            icon: "🎯",
            color: "purple",
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

  // Helper function to create old format modal sections
  const createOldFormatSections = (
    matchingRow: Record<string, unknown>
  ): ModalSection[] => {
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

    const complexity = Number(
      matchingRow["Komplexität"] || matchingRow["Complexity"] || 0
    );
    const cost = Number(matchingRow["Kosten (€)"] || matchingRow["Cost"] || 0);
    const roi = Number(matchingRow["ROI"] || 0);
    const risk = Number(matchingRow["Risiko"] || matchingRow["Risk"] || 0);
    const strategicAlignment = Number(
      matchingRow["Strategische Ausrichtung"] ||
        matchingRow["Strategic Alignment"] ||
        0
    );

    const complexityNote = String(matchingRow["Erläuterung"] || "");
    const costNote = String(matchingRow["Erläuterung.1"] || "");
    const roiNote = String(matchingRow["Erläuterung.2"] || "");
    const riskNote = String(matchingRow["Erläuterung.3"] || "");
    const strategicNote = String(matchingRow["Erläuterung.4"] || "");

    const sections: ModalSection[] = [];

    // Quick stats section
    const stats: ModalStat[] = [];
    if (owner)
      stats.push({
        label: t("modal.owner"),
        value: owner,
        icon: "👤",
        color: "blue",
      });
    if (priority)
      stats.push({
        label: t("modal.priority"),
        value: priority,
        icon: "⭐",
        color: getPriorityColor(priority),
      });
    if (finalPrio)
      stats.push({
        label: t("modal.finalPriority"),
        value: finalPrio,
        icon: "🎯",
        color: "purple",
      });

    if (stats.length > 0) {
      sections.push({
        type: "quickStats",
        title: t("modal.quickOverview"),
        stats,
      });
    }

    // Problem/Solution section
    if (problem || solution) {
      sections.push({
        type: "twoColumn",
        leftSection: {
          title: t("matrix.sections.problem"),
          content: problem || t("modal.noDataAvailable"),
          icon: "🚫",
          bgColor: "red",
        },
        rightSection: {
          title: t("matrix.sections.solution"),
          content: solution || t("modal.noDataAvailable"),
          icon: "✨",
          bgColor: "green",
        },
      });
    }

    // Metrics section
    const metrics: ModalMetric[] = [];
    if (complexity)
      metrics.push({
        id: "complexity",
        label: t("modal.complexity"),
        value: complexity,
        maxValue: 5,
        note: complexityNote || undefined,
        icon: "🔧",
        color: "blue",
        description: t("modal.complexityDesc"),
      });
    if (cost)
      metrics.push({
        id: "cost",
        label: t("modal.cost"),
        value: cost,
        maxValue: 5,
        note: costNote || undefined,
        icon: "💰",
        color: "yellow",
        description: t("modal.costDesc"),
      });
    if (roi)
      metrics.push({
        id: "roi",
        label: t("modal.roi"),
        value: roi,
        maxValue: 5,
        note: roiNote || undefined,
        icon: "📈",
        color: "green",
        description: t("modal.roiDesc"),
      });
    if (risk)
      metrics.push({
        id: "risk",
        label: t("modal.risk"),
        value: risk,
        maxValue: 5,
        note: riskNote || undefined,
        icon: "⚠️",
        color: "red",
        description: t("modal.riskDesc"),
      });
    if (strategicAlignment)
      metrics.push({
        id: "strategic",
        label: t("modal.strategicAlignment"),
        value: strategicAlignment,
        maxValue: 5,
        note: strategicNote || undefined,
        icon: "🎯",
        color: "purple",
        description: t("modal.strategicDesc"),
      });

    if (metrics.length > 0) {
      sections.push({
        type: "metricsGrid",
        title: t("modal.projectMetrics"),
        description: t("modal.metricsDescription"),
        metrics,
      });
    }

    // Additional information section
    const excludedFields = [
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
    ];

    const additionalItems = Object.entries(matchingRow)
      .filter(
        ([key, value]) =>
          value &&
          typeof value === "string" &&
          value.trim() &&
          !excludedFields.includes(key) &&
          !key.startsWith("Unnamed")
      )
      .map(([key, value]) => ({ label: key, value: safeStringify(value) }));

    if (additionalItems.length > 0) {
      sections.push({
        type: "additionalInfo",
        title: t("modal.additionalInformation"),
        items: additionalItems,
      });
    }

    return sections;
  };

  const handleIdeaClick = async (source: string, idee: string) => {
    setSelectedIdea({ source, idee });
    const data = await getIdeasFor(source);
    if (!data) return;

    // Check for new format first (structured ideas array)
    const newFormatIdeas = (data as { ideas?: NewFormatIdea[] }).ideas;
    if (Array.isArray(newFormatIdeas)) {
      const matchingIdea = newFormatIdeas.find((idea) => idea.ideaKey === idee);

      if (matchingIdea) {
        // Create comprehensive project information with all available data
        const formattedSections = [
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
                icon: "👤",
                color: "blue",
              },
              {
                label: t("modal.priority"),
                value: matchingIdea.priority,
                icon: "⭐",
                color: getPriorityColor(matchingIdea.priority),
              },
              {
                label: t("modal.finalPriority"),
                value: String(matchingIdea.finalPrio),
                icon: "🎯",
                color: "purple",
              },
            ],
          },
          {
            type: "twoColumn",
            leftSection: {
              title: t("matrix.sections.problem"),
              content: getLocalizedString(matchingIdea.problemKey),
              icon: "🚫",
              bgColor: "red",
            },
            rightSection: {
              title: t("matrix.sections.solution"),
              content: getLocalizedString(matchingIdea.solutionKey),
              icon: "✨",
              bgColor: "green",
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
                icon: "🔧",
                color: "blue",
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
                icon: "💰",
                color: "yellow",
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
                icon: "📈",
                color: "green",
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
                icon: "⚠️",
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
                icon: "🎯",
                color: "purple",
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

        setProjectBrief(JSON.stringify(formattedSections));
      }
    } else {
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
                      icon: "🚫",
                      bgColor: "red",
                    },
                    rightSection: {
                      title: t("matrix.sections.solution"),
                      content: solution || t("modal.noDataAvailable"),
                      icon: "✨",
                      bgColor: "green",
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
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
          <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">💡</span>
              <div className="flex-1">
                <div className="text-2xl">
                  {selectedIdea?.idee
                    ? getLocalizedString(selectedIdea.idee)
                    : ""}
                </div>
                <div className="text-sm text-muted-foreground font-normal mt-1">
                  {selectedIdea?.source && (
                    <span className="inline-flex items-center gap-1">
                      <span>📂</span>
                      {participantNormalized.find(
                        (p) =>
                          p.normalized === normalize(selectedIdea.source || "")
                      )?.display || selectedIdea.source}
                    </span>
                  )}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-8rem)]">
            {projectBrief &&
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
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          📊 {section.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {section.stats?.map(
                            (stat: ModalStat, idx: number) => (
                              <div
                                key={`stat-${stat.label}-${stat.value}-${idx}`}
                                className={`bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border-l-4 ${getBorderColorClass(
                                  stat.color
                                )}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{stat.icon}</span>
                                  <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                      {stat.label}
                                    </div>
                                    <div className="font-bold text-lg">
                                      {stat.value}
                                    </div>
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
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div
                          className={`p-6 rounded-xl border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10`}
                        >
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                            {section.leftSection.icon}{" "}
                            {section.leftSection.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {section.leftSection.content}
                          </p>
                        </div>
                        <div
                          className={`p-6 rounded-xl border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10`}
                        >
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                            {section.rightSection.icon}{" "}
                            {section.rightSection.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {section.rightSection.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Metrics Grid */}
                    {section.type === "metricsGrid" && (
                      <div className="mb-6">
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            📊 {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-muted-foreground text-sm">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {section.metrics?.map(
                            (metric: ModalMetric, idx: number) => (
                              <div
                                key={`metric-${metric.id}`}
                                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                      {metric.icon}
                                    </span>
                                    <div>
                                      <h4 className="font-semibold">
                                        {metric.label}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {metric.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className={`px-3 py-1 rounded-full text-sm font-bold ${getBackgroundColorClass(
                                      metric.color
                                    )}`}
                                  >
                                    {metric.value}/{metric.maxValue}
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                  <div className="flex gap-1 mb-2">
                                    {Array.from(
                                      { length: metric.maxValue },
                                      (_, i) => (
                                        <div
                                          key={i}
                                          className={`flex-1 h-2 rounded-full ${
                                            i < metric.value
                                              ? getProgressBarColorClass(
                                                  metric.color
                                                )
                                              : "bg-gray-200 dark:bg-gray-700"
                                          }`}
                                        />
                                      )
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground text-center">
                                    {getMetricLevelText(metric.value)}
                                  </div>
                                </div>

                                {/* Note */}
                                {metric.note && (
                                  <div className="pt-3 border-t border-border/30">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
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
                      <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          📋 {section.title}
                        </h3>
                        <div className="space-y-4">
                          {section.items?.map(
                            (item: ModalItem, idx: number) => (
                              <div
                                key={`summary-${item.label}-${idx}`}
                                className="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                              >
                                <div className="flex-shrink-0 w-16 text-center">
                                  <div className="text-lg font-bold text-primary">
                                    {item.value}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.label}
                                  </div>
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            📄 {section.title}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.items?.map(
                              (item: ModalItem, idx: number) => (
                                <div
                                  key={`additional-${item.label}-${idx}`}
                                  className="p-4 bg-muted/30 rounded-lg border border-border/50"
                                >
                                  <h4 className="font-semibold text-sm mb-2">
                                    {item.label}
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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
                      <div className="flex items-center gap-3 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mx-6">
                        <span className="text-3xl">{section.icon}</span>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {section.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
