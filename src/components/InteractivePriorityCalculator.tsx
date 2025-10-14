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
import {
  DuvenbeckPriorityCalculator,
  DuvenbeckScoringCriteria,
  WeightingConfig,
} from "@/lib/priority-calculator";
import { Download, ExternalLink, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

export function InteractivePriorityCalculator({
  ideas,
}: Readonly<InteractivePriorityCalculatorProps>) {
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

  // Helper function to get risk assessment
  const getRiskAssessment = (score: number) => {
    if (score >= 4) return t("priorityAnalysis.modal.riskLevels.low");
    if (score >= 3) return t("priorityAnalysis.modal.riskLevels.moderate");
    if (score >= 2) return t("priorityAnalysis.modal.riskLevels.high");
    return t("priorityAnalysis.modal.riskLevels.veryHigh");
  };

  // Helper function to get strategic alignment assessment
  const getStrategicAssessment = (score: number) => {
    if (score >= 4) return t("priorityAnalysis.modal.strategicLevels.high");
    if (score >= 3) return t("priorityAnalysis.modal.strategicLevels.moderate");
    if (score >= 2) return t("priorityAnalysis.modal.strategicLevels.low");
    return t("priorityAnalysis.modal.strategicLevels.poor");
  };

  // Helper functions to get translated initiative names and descriptions
  const getTranslatedInitiativeName = (
    ideaId: string,
    fallbackName: string
  ) => {
    const translationKey = `priorityAnalysis.initiatives.${ideaId}.name`;
    const translated = t(translationKey);
    // If translation key doesn't exist, t() returns the key itself
    return translated !== translationKey ? translated : fallbackName;
  };

  const getTranslatedInitiativeDescription = (
    ideaId: string,
    fallbackDescription: string,
    initiativeName: string
  ) => {
    const translationKey = `priorityAnalysis.initiatives.${ideaId}.description`;
    const translated = t(translationKey);
    // If translation key doesn't exist, t() returns the key itself
    if (translated !== translationKey) {
      return translated;
    }
    // If no specific translation exists, use the AI-powered solution pattern
    return t("priorityAnalysis.modal.aiPoweredSolution", {
      name: initiativeName.toLowerCase(),
    });
  };
  const [weights, setWeights] = useState<WeightingConfig>(
    DuvenbeckPriorityCalculator.DEFAULT_WEIGHTS
  );
  const [selectedScenario, setSelectedScenario] = useState<string>("custom");
  const [selectedIdea, setSelectedIdea] = useState<(typeof ideas)[0] | null>(
    null
  );
  const [projectBrief, setProjectBrief] = useState<string>("");

  // Helper functions for color mappings and modal data creation
  const getPriorityColor = (priority: string): "green" | "yellow" | "red" => {
    if (priority === "A") return "green";
    if (priority === "B") return "yellow";
    return "red";
  };

  const getMetricLevelText = (value: number): string => {
    if (value > 3) return "High";
    if (value > 1) return "Medium";
    return "Low";
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
            value: idea.id.includes("hr_cv")
              ? "Sarah Martinez"
              : idea.id.includes("compliance")
              ? "Muriel Berning"
              : idea.id.includes("it_")
              ? "Robin Giesen"
              : idea.id.includes("marketing")
              ? "Marketing Team"
              : idea.id.includes("corp_dev")
              ? "Strategy Team"
              : "Department Lead",
            icon: "",
            color: "blue",
          },
          {
            label: t("priorityAnalysis.rankings.department"),
            value: idea.department,
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
          idea?.department || "",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("priorityAnalysis.calculator.weightConfiguration")}
              </CardTitle>
              <CardDescription>
                {t("priorityAnalysis.calculator.total")}:{" "}
                {Math.round(totalWeight)}%
                {Math.abs(totalWeight - 100) > 0.1 && (
                  <Badge variant="destructive" className="ml-2">
                    {t("priorityAnalysis.calculator.mustEqual100")}
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scenario Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("priorityAnalysis.calculator.predefinedScenarios")}
                </label>
                <Select
                  value={selectedScenario}
                  onValueChange={handleScenarioChange}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "priorityAnalysis.calculator.selectScenario"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">
                      {t("priorityAnalysis.calculator.customWeights")}
                    </SelectItem>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.name} value={scenario.name}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedScenario !== "custom" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {
                      scenarios.find((s) => s.name === selectedScenario)
                        ?.description
                    }
                  </p>
                )}
              </div>

              {/* Weight Sliders */}
              {Object.entries(weights).map(([criterion, weight]) => (
                <div key={criterion}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      {criterion.charAt(0).toUpperCase() +
                        criterion.slice(1).replace(/([A-Z])/g, " $1")}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              {Object.entries(
                                DuvenbeckPriorityCalculator.SCORING_GUIDELINES[
                                  criterion as keyof typeof DuvenbeckPriorityCalculator.SCORING_GUIDELINES
                                ]
                              ).map(([score, desc]) => (
                                <p key={score} className="text-xs">
                                  <strong>{score}:</strong> {desc}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Badge variant="secondary">{Math.round(weight)}%</Badge>
                  </div>
                  <Slider
                    value={[weight]}
                    onValueChange={(value) =>
                      handleWeightChange(
                        criterion as keyof WeightingConfig,
                        value
                      )
                    }
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="rankings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rankings" className="cursor-pointer">
                {t("priorityAnalysis.tabs.rankings")}
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="cursor-pointer">
                {t("priorityAnalysis.tabs.breakdown")}
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="cursor-pointer">
                {t("priorityAnalysis.tabs.scenarios")}
              </TabsTrigger>
            </TabsList>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
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
                                  <p className="text-xs">
                                    {t(
                                      "priorityAnalysis.rankings.tooltips.rank"
                                    )}
                                  </p>
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
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-xs"
                                >
                                  <p className="text-xs">
                                    {t(
                                      "priorityAnalysis.rankings.tooltips.aiInitiative"
                                    )}
                                  </p>
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
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-xs"
                                >
                                  <p className="text-xs">
                                    {t(
                                      "priorityAnalysis.rankings.tooltips.department"
                                    )}
                                  </p>
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
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-xs"
                                >
                                  <p className="text-xs">
                                    {t(
                                      "priorityAnalysis.rankings.tooltips.score"
                                    )}
                                  </p>
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
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-xs"
                                >
                                  <p className="text-xs">
                                    {t(
                                      "priorityAnalysis.rankings.tooltips.category"
                                    )}
                                  </p>
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
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {idea
                                    ? getTranslatedInitiativeName(
                                        idea.id,
                                        result.name
                                      )
                                    : result.name}
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </div>
                                {idea?.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-2">
                                    {getTranslatedInitiativeDescription(
                                      idea.id,
                                      idea.description,
                                      idea.name
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{idea?.department}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  result.finalScore >= 80
                                    ? "default"
                                    : result.finalScore >= 65
                                    ? "secondary"
                                    : result.finalScore >= 45
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {result.finalScore}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  result.category === "Top Priority"
                                    ? "default"
                                    : result.category === "High Priority"
                                    ? "secondary"
                                    : result.category === "Medium Priority"
                                    ? "outline"
                                    : "destructive"
                                }
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
            </TabsContent>

            {/* Detailed Breakdown Tab */}
            <TabsContent value="breakdown">
              <Card>
                <CardHeader>
                  <CardTitle>{t("priorityAnalysis.breakdown.title")}</CardTitle>
                  <CardDescription>
                    {t("priorityAnalysis.breakdown.subtitle")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("priorityAnalysis.breakdown.initiative")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.calculator.complexity")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.calculator.cost")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.calculator.roi")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.calculator.risk")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.calculator.strategicAlignment")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.breakdown.total")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRankings.slice(0, 10).map((result) => {
                        const idea = ideas.find((i) => i.id === result.id);
                        return (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {idea
                                ? getTranslatedInitiativeName(
                                    idea.id,
                                    result.name
                                  )
                                : result.name}
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>{result.breakdown.complexity.score}</div>
                                <div className="text-xs text-muted-foreground">
                                  (
                                  {Math.round(
                                    result.breakdown.complexity.weighted * 20
                                  )}
                                  )
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>{result.breakdown.cost.score}</div>
                                <div className="text-xs text-muted-foreground">
                                  (
                                  {Math.round(
                                    result.breakdown.cost.weighted * 20
                                  )}
                                  )
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>{result.breakdown.roi.score}</div>
                                <div className="text-xs text-muted-foreground">
                                  (
                                  {Math.round(
                                    result.breakdown.roi.weighted * 20
                                  )}
                                  )
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>{result.breakdown.risk.score}</div>
                                <div className="text-xs text-muted-foreground">
                                  (
                                  {Math.round(
                                    result.breakdown.risk.weighted * 20
                                  )}
                                  )
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>
                                  {result.breakdown.strategicAlignment.score}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  (
                                  {Math.round(
                                    result.breakdown.strategicAlignment
                                      .weighted * 20
                                  )}
                                  )
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {result.finalScore}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scenario Comparison Tab */}
            <TabsContent value="scenarios">
              <ScenarioComparison ideas={ideas} />
            </TabsContent>
          </Tabs>
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
                  {selectedIdea.department}
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
