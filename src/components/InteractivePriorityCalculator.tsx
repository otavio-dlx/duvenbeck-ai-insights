import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tag } from "@/contexts/TaggingContext";
import {
  DuvenbeckPriorityCalculator,
  DuvenbeckScoringCriteria,
  WeightingConfig,
} from "@/lib/priority-calculator";
import { Download, ExternalLink, Info, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { IdeaTagsSection } from "./IdeaTagsSection";

interface InteractivePriorityCalculatorProps {
  ideas: Array<{
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  }>;
}

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

import { FilterPanel } from "@/components/FilterPanel";

interface InteractivePriorityCalculatorProps {
  ideas: Array<{
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  }>;
  departments?: string[];
  selectedDepartment?: string;
  onDepartmentChange?: (value: string) => void;
}

export function InteractivePriorityCalculator({
  ideas,
  departments,
  selectedDepartment,
  onDepartmentChange,
}: Readonly<InteractivePriorityCalculatorProps>) {
  // Restore original: no tag filter, no filteredIdeas
  const { t } = useTranslation();

  // Helper function to translate categories
  const translateCategory = (category: string) => {
    switch (category) {
      case "Top Priority":
        return t("priorityAnalysis.categories.topPriority");
      case "High Priority":
        return t("priorityAnalysis.categories.highPriority");
      case "Medium Priority":
        return t("priorityAnalysis.categories.mediumPriority");
      case "Low Priority":
        return t("priorityAnalysis.categories.lowPriority");
      default:
        return category;
    }
  };

  // Helper function to get complexity assessment
  const getComplexityAssessment = (score: number) => {
    if (score >= 4) return t("priorityAnalysis.modal.complexityLevels.low");
    if (score >= 3)
      return t("priorityAnalysis.modal.complexityLevels.moderate");
    if (score >= 2) return t("priorityAnalysis.modal.complexityLevels.high");
    return t("priorityAnalysis.modal.complexityLevels.veryHigh");
  };

  // Helper function to get cost assessment
  const getCostAssessment = (score: number) => {
    if (score >= 4) return t("priorityAnalysis.modal.costLevels.low");
    if (score >= 3) return t("priorityAnalysis.modal.costLevels.moderate");
    if (score >= 2) return t("priorityAnalysis.modal.costLevels.high");
    return t("priorityAnalysis.modal.costLevels.veryHigh");
  };

  // Helper function to get ROI assessment
  const getRoiAssessment = (score: number) => {
    if (score >= 5) return t("priorityAnalysis.modal.roiLevels.exceptional");
    if (score >= 4) return t("priorityAnalysis.modal.roiLevels.high");
    if (score >= 3) return t("priorityAnalysis.modal.roiLevels.moderate");
    if (score >= 2) return t("priorityAnalysis.modal.roiLevels.low");
    return t("priorityAnalysis.modal.roiLevels.minimal");
  };

  // Helper functions to get translated initiative names and descriptions
  const getTranslatedInitiativeName = (
    ideaId: string,
    fallbackName: string
  ) => {
    // The name should already be translated by the data-mapper
    // Just return the fallback name which is the already-translated name
    return fallbackName;
  };

  const getTranslatedInitiativeDescription = (
    ideaId: string,
    fallbackDescription: string,
    initiativeName: string
  ) => {
    // The description should already be translated by the data-mapper
    // Just return the fallback description which is the already-translated description
    return fallbackDescription;
  };
  const [weights, setWeights] = useState<WeightingConfig>(
    DuvenbeckPriorityCalculator.DEFAULT_WEIGHTS
  );
  const [selectedScenario, setSelectedScenario] = useState<string>("custom");
  const [selectedIdea, setSelectedIdea] = useState<(typeof ideas)[0] | null>(
    null
  );
  const [projectBrief, setProjectBrief] = useState<string>("");

  const getMetricLevelText = (value: number): string => {
    if (value > 3) return "High";
    if (value > 1) return "Medium";
    return "Low";
  };

  // Helper function to get idea owner based on ID
  const getIdeaOwner = (ideaId: string): string => {
    if (ideaId.includes("hr_cv")) return "Sarah Martinez";
    if (ideaId.includes("compliance")) return "Muriel Berning";
    if (ideaId.includes("it_")) return "Robin Giesen";
    if (ideaId.includes("marketing")) return "Marketing Team";
    if (ideaId.includes("corp_dev")) return "Strategy Team";
    return "Department Lead";
  };

  // Helper function to map department names to display names
  const getDepartmentDisplayName = (department: string): string => {
    // For now, return the original department name to see what's actually being displayed
    return department;
  };

  // Helper function to get badge variant based on score
  const getScoreBadgeVariant = (
    score: number
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 65) return "secondary";
    if (score >= 45) return "outline";
    return "destructive";
  };

  // Helper function to get badge variant based on category
  const getCategoryBadgeVariant = (
    category: string
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (category === "Top Priority") return "default";
    if (category === "High Priority") return "secondary";
    if (category === "Medium Priority") return "outline";
    return "destructive";
  };

  // Helper function to create modal sections adapted for InteractivePriorityCalculator data
  const createModalSections = (idea: (typeof ideas)[0]): ModalSection[] => {
    return [
      {
        type: "quickStats",
        title: t("modal.quickOverview"),
        stats: [
          {
            label: t("modal.owner"),
            value: getIdeaOwner(idea.id),
            icon: "",
            color: "blue",
          },
          {
            label: t("priorityAnalysis.rankings.department"),
            value: getDepartmentDisplayName(idea.department),
            icon: "",
            color: "green",
          },
          {
            label: t("priorityAnalysis.rankings.score"),
            value: String(
              DuvenbeckPriorityCalculator.rankIdeas([idea], weights)[0]
                ?.finalScore || 0
            ),
            icon: "",
            color: "purple",
          },
        ],
      },
      {
        type: "twoColumn",
        leftSection: {
          title: t("priorityAnalysis.modal.problemStatement"),
          content:
            idea.description?.split(".")[0] + "." || t("modal.noDataAvailable"),
          icon: "",
          bgColor: "red",
        },
        rightSection: {
          title: t("priorityAnalysis.modal.proposedSolution"),
          content: getTranslatedInitiativeDescription(
            idea.id,
            idea.description || "",
            idea.name
          ),
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
            value: idea.scores.complexity,
            maxValue: 5,
            icon: "",
            color: "neutral",
            description: t("modal.complexityDesc"),
          },
          {
            id: "cost",
            label: t("modal.cost"),
            value: idea.scores.cost,
            maxValue: 5,
            icon: "",
            color: "red",
            description: t("modal.costDesc"),
          },
          {
            id: "roi",
            label: t("modal.roi"),
            value: idea.scores.roi,
            maxValue: 5,
            icon: "",
            color: "neutral",
            description: t("modal.roiDesc"),
          },
          {
            id: "risk",
            label: t("modal.risk"),
            value: idea.scores.risk,
            maxValue: 5,
            icon: "",
            color: "red",
            description: t("modal.riskDesc"),
          },
          {
            id: "strategic",
            label: t("modal.strategicAlignment"),
            value: idea.scores.strategicAlignment,
            maxValue: 5,
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
            value: `${idea.scores.complexity}/5`,
            description: getComplexityAssessment(idea.scores.complexity),
          },
          {
            label: t("modal.investmentLevel"),
            value: `${idea.scores.cost}/5`,
            description: getCostAssessment(idea.scores.cost),
          },
          {
            label: t("modal.expectedReturn"),
            value: `${idea.scores.roi}/5`,
            description: getRoiAssessment(idea.scores.roi),
          },
        ],
      },
    ];
  };

  // Calculate current rankings
  const currentRankings = useMemo(() => {
    return DuvenbeckPriorityCalculator.rankIdeas(ideas, weights);
  }, [ideas, weights]);

  // Available scenarios
  const scenarios = DuvenbeckPriorityCalculator.getWeightScenarios();

  // Handle weight changes
  const handleWeightChange = (
    criterion: keyof WeightingConfig,
    value: number[]
  ) => {
    const newWeights = { ...weights, [criterion]: value[0] };

    // Auto-adjust other weights to maintain 100% total
    const otherCriteria = Object.keys(weights).filter(
      (key) => key !== criterion
    ) as Array<keyof WeightingConfig>;
    const currentTotal = Object.values(newWeights).reduce(
      (sum, w) => sum + w,
      0
    );

    if (currentTotal !== 100) {
      const excess = currentTotal - 100;
      const adjustmentPerCriterion = excess / otherCriteria.length;

      otherCriteria.forEach((key) => {
        newWeights[key] = Math.max(
          1,
          Math.min(50, newWeights[key] - adjustmentPerCriterion)
        );
      });
    }

    setWeights(newWeights);
    setSelectedScenario("custom");
  };

  // Handle scenario selection
  const handleScenarioChange = (scenarioName: string) => {
    if (scenarioName === "custom") return;

    const scenario = scenarios.find((s) => s.name === scenarioName);
    if (scenario) {
      setWeights(scenario.weights);
      setSelectedScenario(scenarioName);
    }
  };

  // Reset to default weights
  const resetWeights = () => {
    setWeights(DuvenbeckPriorityCalculator.DEFAULT_WEIGHTS);
    setSelectedScenario("Default (Balanced)");
  };

  // Export results
  const exportResults = () => {
    const csvHeaders = [
      t("priorityAnalysis.rankings.rank"),
      t("priorityAnalysis.rankings.aiInitiative"),
      t("priorityAnalysis.rankings.department"),
      t("priorityAnalysis.breakdown.total"),
      t("priorityAnalysis.rankings.category"),
      t("priorityAnalysis.calculator.complexity"),
      t("priorityAnalysis.calculator.cost"),
      t("priorityAnalysis.calculator.roi"),
      t("priorityAnalysis.calculator.risk"),
      t("priorityAnalysis.calculator.strategicAlignment"),
    ];

    const csvContent = [
      csvHeaders.join(","),
      ...currentRankings.map((result) => {
        const idea = ideas.find((idea) => idea.id === result.id);
        return [
          result.rank,
          `"${
            idea
              ? getTranslatedInitiativeName(idea.id, result.name)
              : result.name
          }"`,
          idea ? getDepartmentDisplayName(idea.department) : "",
          result.finalScore,
          result.category,
          result.breakdown.complexity.score,
          result.breakdown.cost.score,
          result.breakdown.roi.score,
          result.breakdown.risk.score,
          result.breakdown.strategicAlignment.score,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-priority-analysis-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("priorityAnalysis.calculator.title")}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetWeights}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("priorityAnalysis.calculator.reset")}
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                {t("priorityAnalysis.calculator.exportCsv")}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {t("priorityAnalysis.calculator.subtitle")}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filter and Rankings Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Department Filter Sidebar */}
        {departments && selectedDepartment !== undefined && onDepartmentChange && (
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterPanel
              departments={departments}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={onDepartmentChange}
              selectedDay="all"
              onDayChange={() => {}}
              onReset={() => onDepartmentChange("all")}
            />
          </div>
        )}

        {/* Rankings Panel Only */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("priorityAnalysis.rankings.title")}</CardTitle>
              <CardDescription>
                {t("priorityAnalysis.rankings.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <div className="flex items-center gap-1">
                        {t("priorityAnalysis.rankings.rank")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-xs"
                            >
                              {t("priorityAnalysis.rankings.rankTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        {t("priorityAnalysis.rankings.aiInitiative")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              {t("priorityAnalysis.rankings.aiInitiativeTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        {t("priorityAnalysis.rankings.department")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipContent side="bottom" className="max-w-xs">
                              {t("priorityAnalysis.rankings.departmentTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        {t("priorityAnalysis.rankings.score")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipContent side="bottom" className="max-w-xs">
                              {t("priorityAnalysis.rankings.scoreTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        {t("priorityAnalysis.rankings.category")}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipContent side="bottom" className="max-w-xs">
                              {t("priorityAnalysis.rankings.categoryTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRankings.map((result) => {
                    const idea = ideas.find((i) => i.id === result.id);
                    return (
                      <TableRow
                        key={result.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          const idea = ideas.find(
                            (i) => i.id === result.id
                          );
                          if (idea) {
                            setSelectedIdea(idea);
                            const modalSections = createModalSections(idea);
                            setProjectBrief(JSON.stringify(modalSections));
                          }
                        }}
                      >
                        <TableCell className="font-medium">
                          #{result.rank}
                        </TableCell>
                        <TableCell>
                          {idea
                            ? getTranslatedInitiativeName(idea.id, idea.name)
                            : result.name}
                        </TableCell>
                        <TableCell>
                          {idea
                            ? getDepartmentDisplayName(idea.department)
                            : ""}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getScoreBadgeVariant(
                              result.finalScore
                            )}
                          >
                            {result.finalScore}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getCategoryBadgeVariant(
                              result.category
                            )}
                          >
                            {translateCategory(result.category)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
                    {/* Idea Details Modal */}
                    <Dialog
                      open={selectedIdea !== null}
                      onOpenChange={() => setSelectedIdea(null)}
                    >
                      <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0 bg-white">
          <DialogHeader className="p-8 pb-6 border-b border-gray-200 bg-white">
            <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {selectedIdea
                ? getTranslatedInitiativeName(
                    selectedIdea.id,
                    selectedIdea.name
                  )
                : ""}
            </DialogTitle>
            {selectedIdea?.department && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 w-8 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">
                  {getDepartmentDisplayName(selectedIdea.department)}
                </span>
              </div>
            )}
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-8rem)] bg-gray-50">
            {/* AI-Generated Tags Section */}
            {selectedIdea && (
              <div className="p-6 border-b border-border/10">
                <IdeaTagsSection
                  ideaText={getTranslatedInitiativeName(
                    selectedIdea.id,
                    selectedIdea.name
                  )}
                />
              </div>
            )}
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
                              {section.leftSection?.title}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {section.leftSection?.content}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 border-l-4 border-gray-300 shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                            <h3 className="text-lg font-bold text-gray-700">
                              {section.rightSection?.title}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {section.rightSection?.content}
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
    </div>
  );
}

// Custom tooltip component for the scatter chart
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: ChartDataItem;
  }>;
  axisLabels: Record<AxisOption, string>;
  xAxis: AxisOption;
  yAxis: AxisOption;
  t: (key: string) => string;
  getDepartmentDisplayName: (department: string) => string;
}

function CustomTooltip({
  active,
  payload,
  axisLabels,
  xAxis,
  yAxis,
  t,
  getDepartmentDisplayName,
}: Readonly<CustomTooltipProps>) {
  if (active && payload?.length && payload[0]?.payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-gray-600">
          {getDepartmentDisplayName(data.department)}
        </p>
        <p className="text-sm">
          {axisLabels[xAxis]}: {data.x}/5
        </p>
        <p className="text-sm">
          {axisLabels[yAxis]}: {data.y}/5
        </p>
        <p className="text-sm">
          {t("priorityAnalysis.rankings.score")}: {data.z}
        </p>
        <p className="text-sm">
          {t("priorityAnalysis.rankings.rank")}: #{data.rank}
        </p>
      </div>
    );
  }
  return null;
}

// Type definitions for Insights Bubble Chart
type GroupingOption =
  | "department"
  | "category"
  | "complexity"
  | "roi"
  | "risk"
  | "cost"
  | "strategicAlignment";
type AxisOption = "complexity" | "cost" | "roi" | "risk" | "strategicAlignment";

interface ChartDataItem {
  id: string;
  name: string;
  department: string;
  x: number;
  y: number;
  z: number;
  category: string;
  rank: number;
  tags: Tag[]; // Keep as array but will be empty initially
  primaryTag: string;
  idea: {
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  };
}

// Insights Bubble Chart Component
interface InsightsBubbleChartProps {
  ideas: Array<{
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  }>;
  rankings: Array<{
    id: string;
    name: string;
    finalScore: number;
    category: string;
    rank: number;
    breakdown: {
      complexity: { score: number; weighted: number };
      cost: { score: number; weighted: number };
      roi: { score: number; weighted: number };
      risk: { score: number; weighted: number };
      strategicAlignment: { score: number; weighted: number };
    };
  }>;
  onIdeaClick: (idea: {
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  }) => void;
  getDepartmentDisplayName: (department: string) => string;
}

function InsightsBubbleChart({
  ideas,
  rankings,
  onIdeaClick,
  getDepartmentDisplayName,
}: Readonly<InsightsBubbleChartProps>) {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState<GroupingOption>("department");
  const [xAxis, setXAxis] = useState<AxisOption>("complexity");
  const [yAxis, setYAxis] = useState<AxisOption>("strategicAlignment");

  // Create a memoized tooltip content function
  const tooltipContent = useMemo(() => {
    const axisLabels = {
      complexity: t("priorityAnalysis.calculator.complexity"),
      cost: t("priorityAnalysis.calculator.cost"),
      roi: t("priorityAnalysis.calculator.roi"),
      risk: t("priorityAnalysis.calculator.risk"),
      strategicAlignment: t("priorityAnalysis.calculator.strategicAlignment"),
    };

    return (props: { active?: boolean; payload?: unknown[] }) => (
      <CustomTooltip
        active={props.active}
        payload={props.payload as Array<{ payload?: ChartDataItem }>}
        axisLabels={axisLabels}
        xAxis={xAxis}
        yAxis={yAxis}
        t={t}
        getDepartmentDisplayName={getDepartmentDisplayName}
      />
    );
  }, [t, xAxis, yAxis, getDepartmentDisplayName]);

  // Helper function to translate initiative names (local to this component)
  const getTranslatedInitiativeName = useMemo(() => {
    return (ideaId: string, fallbackName: string) => {
      const translationKey = `priorityAnalysis.initiatives.${ideaId}.name`;
      const translated = t(translationKey);
      return translated !== translationKey ? translated : fallbackName;
    };
  }, [t]);

  // Helper functions for grouping
  const getComplexityGroup = (value: number): string => {
    if (value >= 4) return "Low Complexity";
    if (value >= 3) return "Medium Complexity";
    return "High Complexity";
  };

  const getRoiGroup = (value: number): string => {
    if (value >= 4) return "High ROI";
    if (value >= 3) return "Medium ROI";
    return "Low ROI";
  };

  const getRiskGroup = (value: number): string => {
    if (value >= 4) return "Low Risk";
    if (value >= 3) return "Medium Risk";
    return "High Risk";
  };

  const getCostGroup = (value: number): string => {
    if (value >= 4) return "Low Cost";
    if (value >= 3) return "Medium Cost";
    return "High Cost";
  };

  const getStrategicGroup = (value: number): string => {
    if (value >= 4) return "High Strategic";
    if (value >= 3) return "Medium Strategic";
    return "Low Strategic";
  };

  // Helper function to determine group key based on grouping option
  const getGroupKey = useMemo(() => {
    return (item: ChartDataItem, groupBy: GroupingOption): string => {
      switch (groupBy) {
        case "department":
          return item.department;
        case "category":
          return item.category;
        case "complexity":
          return getComplexityGroup(item.x);
        case "roi":
          return getRoiGroup(item.y);
        case "risk":
          return getRiskGroup(item.idea.scores.risk);
        case "cost":
          return getCostGroup(item.idea.scores.cost);
        case "strategicAlignment":
          return getStrategicGroup(item.idea.scores.strategicAlignment);
        default:
          return "Other";
      }
    };
  }, []);

  // Load tags for all ideas - REMOVED to prevent infinite loop
  // Tags will be loaded when needed in the modal

  // Color mapping for different groups
  const getGroupColor = useCallback(
    (group: string, groupType: GroupingOption): string => {
      const colorMaps = {
        department: {
          HR: "#ef4444",
          IT: "#3b82f6",
          "Marketing & Communications": "#10b981",
          Compliance: "#f59e0b",
          "Corporate Development": "#8b5cf6",
          Controlling: "#06b6d4",
          "Road Sales SE": "#f97316",
          "Strategic KAM": "#84cc16",
          ESG: "#14b8a6",
          QEHS: "#6366f1",
          Accounting: "#ec4899",
          "Contract Logistics": "#64748b",
          "Central Solution Design": "#78716c",
        },
        category: {
          "Top Priority": "#22c55e",
          "High Priority": "#3b82f6",
          "Medium Priority": "#f59e0b",
          "Low Priority": "#ef4444",
        },
        complexity: {
          "Low Complexity": "#22c55e",
          "Medium Complexity": "#f59e0b",
          "High Complexity": "#ef4444",
        },
        roi: {
          "High ROI": "#22c55e",
          "Medium ROI": "#f59e0b",
          "Low ROI": "#ef4444",
        },
        risk: {
          "Low Risk": "#22c55e",
          "Medium Risk": "#f59e0b",
          "High Risk": "#ef4444",
        },
        cost: {
          "Low Cost": "#22c55e",
          "Medium Cost": "#f59e0b",
          "High Cost": "#ef4444",
        },
        strategicAlignment: {
          "High Strategic": "#22c55e",
          "Medium Strategic": "#f59e0b",
          "Low Strategic": "#ef4444",
        },
      };

      return (
        (colorMaps[groupType] as Record<string, string>)[group] || "#64748b"
      );
    },
    []
  );

  // Prepare data for visualization
  const chartData = useMemo(() => {
    const data = ideas.map((idea) => {
      const ranking = rankings.find((r) => r.id === idea.id);

      return {
        id: idea.id,
        name: getTranslatedInitiativeName(idea.id, idea.name),
        department: idea.department,
        x: idea.scores[xAxis],
        y: idea.scores[yAxis],
        z: ranking?.finalScore || 0,
        category: ranking?.category || "Low Priority",
        rank: ranking?.rank || 0,
        tags: [], // Empty for now to prevent infinite loop
        primaryTag: "No Tags",
        idea: idea,
      };
    });

    return data;
  }, [ideas, rankings, xAxis, yAxis, getTranslatedInitiativeName]);

  // Group data based on selected grouping
  const groupedData = useMemo(() => {
    const groups = new Map<string, typeof chartData>();

    chartData.forEach((item) => {
      const groupKey = getGroupKey(item, groupBy);

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      const groupItems = groups.get(groupKey);
      if (groupItems) {
        groupItems.push(item);
      }
    });

    const result = Array.from(groups.entries()).map(([group, items]) => ({
      group,
      items,
      color: getGroupColor(group, groupBy),
    }));

    return result;
  }, [chartData, groupBy, getGroupKey, getGroupColor]);

  const axisLabels = {
    complexity: t("priorityAnalysis.calculator.complexity"),
    cost: t("priorityAnalysis.calculator.cost"),
    roi: t("priorityAnalysis.calculator.roi"),
    risk: t("priorityAnalysis.calculator.risk"),
    strategicAlignment: t("priorityAnalysis.calculator.strategicAlignment"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("priorityAnalysis.insights.title")}</CardTitle>
        <CardDescription>
          {t("priorityAnalysis.insights.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("priorityAnalysis.insights.groupBy")}
            </label>
            <Select
              value={groupBy}
              onValueChange={(value: GroupingOption) => setGroupBy(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">
                  {t("priorityAnalysis.insights.groupOptions.department")}
                </SelectItem>
                <SelectItem value="category">
                  {t("priorityAnalysis.insights.groupOptions.category")}
                </SelectItem>
                <SelectItem value="complexity">
                  {t("priorityAnalysis.insights.groupOptions.complexity")}
                </SelectItem>
                <SelectItem value="roi">
                  {t("priorityAnalysis.insights.groupOptions.roi")}
                </SelectItem>
                <SelectItem value="risk">
                  {t("priorityAnalysis.insights.groupOptions.risk")}
                </SelectItem>
                <SelectItem value="cost">
                  {t("priorityAnalysis.insights.groupOptions.cost")}
                </SelectItem>
                <SelectItem value="strategicAlignment">
                  {t("priorityAnalysis.insights.groupOptions.strategic")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("priorityAnalysis.insights.xAxis")}
            </label>
            <Select
              value={xAxis}
              onValueChange={(value: AxisOption) => setXAxis(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complexity">
                  {axisLabels.complexity}
                </SelectItem>
                <SelectItem value="cost">{axisLabels.cost}</SelectItem>
                <SelectItem value="roi">{axisLabels.roi}</SelectItem>
                <SelectItem value="risk">{axisLabels.risk}</SelectItem>
                <SelectItem value="strategicAlignment">
                  {axisLabels.strategicAlignment}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("priorityAnalysis.insights.yAxis")}
            </label>
            <Select
              value={yAxis}
              onValueChange={(value: AxisOption) => setYAxis(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complexity">
                  {axisLabels.complexity}
                </SelectItem>
                <SelectItem value="cost">{axisLabels.cost}</SelectItem>
                <SelectItem value="roi">{axisLabels.roi}</SelectItem>
                <SelectItem value="risk">{axisLabels.risk}</SelectItem>
                <SelectItem value="strategicAlignment">
                  {axisLabels.strategicAlignment}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500">
                  No data available for visualization
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Ideas: {ideas.length}, Rankings: {rankings.length}
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={axisLabels[xAxis]}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{
                    value: axisLabels[xAxis],
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={axisLabels[yAxis]}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{
                    value: axisLabels[yAxis],
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={tooltipContent}
                />

                {groupedData.map(({ group, items, color }) => (
                  <Scatter
                    key={group}
                    name={group}
                    data={items}
                    fill={color}
                    onClick={(data) => {
                      if (data?.idea) {
                        onIdeaClick(data.idea);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend and insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-3">
              {t("priorityAnalysis.insights.legend")}
            </h4>
            <div className="space-y-2">
              {groupedData.map(({ group, items, color }) => (
                <div key={group} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">
                    {group} ({items.length})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {t("priorityAnalysis.insights.keyInsights")}
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• {t("priorityAnalysis.insights.bubbleSize")}</p>
              <p>• {t("priorityAnalysis.insights.clickBubble")}</p>
              <p>• {t("priorityAnalysis.insights.groupingHelps")}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Scenario Comparison Component
function ScenarioComparison({
  ideas,
}: Readonly<{
  ideas: InteractivePriorityCalculatorProps["ideas"];
}>) {
  const { t } = useTranslation();
  const scenarios = DuvenbeckPriorityCalculator.getWeightScenarios().slice(
    0,
    4
  ); // Show top 4 scenarios

  const scenarioResults = useMemo(() => {
    return scenarios.map((scenario) => ({
      ...scenario,
      rankings: DuvenbeckPriorityCalculator.rankIdeas(
        ideas,
        scenario.weights
      ).slice(0, 5),
    }));
  }, [ideas, scenarios]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("priorityAnalysis.scenarioComparison.title")}</CardTitle>
        <CardDescription>
          {t("priorityAnalysis.scenarioComparison.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarioResults.map((scenario) => (
            <div key={scenario.name} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{scenario.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {scenario.description}
              </p>
              <div className="space-y-2">
                {scenario.rankings.map((result, index) => {
                  const idea = ideas.find((i) => i.id === result.id);
                  function getTranslatedInitiativeName(
                    id: string,
                    name: string,
                    t: (key: string) => string
                  ):
                    | import("react").ReactNode
                    | Iterable<import("react").ReactNode> {
                    const translationKey = `priorityAnalysis.initiatives.${id}.name`;
                    const translated = t(translationKey);
                    return translated !== translationKey ? translated : name;
                  }
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        {idea
                          ? getTranslatedInitiativeName(idea.id, result.name, t)
                          : result.name}
                      </span>
                      <Badge variant="secondary">{result.finalScore}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
