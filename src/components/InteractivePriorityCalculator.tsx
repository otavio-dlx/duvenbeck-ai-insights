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
  PriorityResult,
  WeightingConfig,
} from "@/lib/priority-calculator";
import {
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface InteractivePriorityCalculatorProps {
  ideas: Array<{
    id: string;
    name: string;
    description?: string;
    department: string;
    scores: DuvenbeckScoringCriteria;
  }>;
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
  const [previousRankings, setPreviousRankings] = useState<Array<
    PriorityResult & { id: string; name: string }
  > | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<(typeof ideas)[0] | null>(
    null
  );

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

    setPreviousRankings(currentRankings);
    setWeights(newWeights);
    setSelectedScenario("custom");
  };

  // Handle scenario selection
  const handleScenarioChange = (scenarioName: string) => {
    if (scenarioName === "custom") return;

    const scenario = scenarios.find((s) => s.name === scenarioName);
    if (scenario) {
      setPreviousRankings(currentRankings);
      setWeights(scenario.weights);
      setSelectedScenario(scenarioName);
    }
  };

  // Reset to default weights
  const resetWeights = () => {
    setPreviousRankings(currentRankings);
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

  // Get ranking change indicator
  const getRankingChange = (currentRank: number, ideaId: string) => {
    if (!previousRankings) return null;

    const previousRank = previousRankings.find((r) => r.id === ideaId)?.rank;
    if (!previousRank || previousRank === currentRank) return null;

    if (previousRank > currentRank) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
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
                          {t("priorityAnalysis.rankings.rank")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.rankings.aiInitiative")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.rankings.department")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.rankings.score")}
                        </TableHead>
                        <TableHead>
                          {t("priorityAnalysis.rankings.category")}
                        </TableHead>
                        <TableHead className="w-12">
                          {t("priorityAnalysis.rankings.change")}
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
                            onClick={() => setSelectedIdea(idea || null)}
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
                            <TableCell>
                              {getRankingChange(result.rank, result.id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">💡</span>
              <div className="flex-1">
                <div className="text-2xl">
                  {selectedIdea
                    ? getTranslatedInitiativeName(
                        selectedIdea.id,
                        selectedIdea.name
                      )
                    : t("priorityAnalysis.modal.aiInitiativeFallback")}
                </div>
                <div className="text-sm text-muted-foreground font-normal mt-1">
                  {selectedIdea?.department} •{" "}
                  {t("priorityAnalysis.modal.analysisTitle")}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-6 pt-4">
              {/* Source Information - Who submitted this and when */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    🏢 {t("priorityAnalysis.modal.sourceDepartment")}
                  </h3>
                  <p className="text-blue-800 font-medium">
                    {selectedIdea.department}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    {t("priorityAnalysis.modal.originatingUnit")}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    👤 {t("priorityAnalysis.modal.initiativeOwner")}
                  </h3>
                  <p className="text-green-800 font-medium">
                    {selectedIdea.id.includes("hr_cv")
                      ? "Sarah Martinez"
                      : selectedIdea.id.includes("compliance")
                      ? "Muriel Berning"
                      : selectedIdea.id.includes("it_")
                      ? "Robin Giesen"
                      : selectedIdea.id.includes("marketing")
                      ? "Marketing Team"
                      : selectedIdea.id.includes("corp_dev")
                      ? "Strategy Team"
                      : "Department Lead"}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    {t("priorityAnalysis.modal.projectSponsor")}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    📅 {t("priorityAnalysis.modal.submissionDate")}
                  </h3>
                  <p className="text-purple-800 font-medium">
                    {t("priorityAnalysis.modal.workshopDate")}
                  </p>
                  <p className="text-purple-600 text-sm mt-1">
                    {t("priorityAnalysis.modal.workshopSession")}
                  </p>
                </div>
              </div>

              {/* Original Problem & Solution */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">
                  🎯 {t("priorityAnalysis.modal.problemSolutionDef")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      {t("priorityAnalysis.modal.problemStatement")}
                    </h4>
                    <p className="text-yellow-800 text-sm">
                      {selectedIdea.description.split(".")[0]}.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      {t("priorityAnalysis.modal.proposedSolution")}
                    </h4>
                    <p className="text-yellow-800 text-sm">
                      {getTranslatedInitiativeDescription(
                        selectedIdea.id,
                        selectedIdea.description,
                        selectedIdea.name
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Scoring Rationale */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  � Detailed Scoring Rationale
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔧</span>
                        <span className="font-semibold">
                          {t("priorityAnalysis.modal.technicalComplexity")}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-blue-100">
                        {selectedIdea.scores.complexity}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>{t("priorityAnalysis.modal.assessment")}:</strong>{" "}
                      {getComplexityAssessment(selectedIdea.scores.complexity)}
                    </div>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💰</span>
                        <span className="font-semibold">
                          {t("priorityAnalysis.modal.investmentRequired")}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100">
                        {selectedIdea.scores.cost}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>
                        {t("priorityAnalysis.modal.estimatedInvestment")}:
                      </strong>{" "}
                      {getCostAssessment(selectedIdea.scores.cost)}
                    </div>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📈</span>
                        <span className="font-semibold">
                          {t("priorityAnalysis.modal.expectedRoi")}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-green-100">
                        {selectedIdea.scores.roi}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>
                        {t("priorityAnalysis.modal.businessImpact")}:
                      </strong>{" "}
                      {getRoiAssessment(selectedIdea.scores.roi)}
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-semibold">
                          {t("priorityAnalysis.modal.riskAssessment")}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-red-100">
                        {selectedIdea.scores.risk}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>
                        {t("priorityAnalysis.modal.riskFactors")}:
                      </strong>{" "}
                      {getRiskAssessment(selectedIdea.scores.risk)}
                    </div>
                  </div>

                  <div className="border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span className="font-semibold">
                          {t("priorityAnalysis.calculator.strategicAlignment")}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-purple-100">
                        {selectedIdea.scores.strategicAlignment}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>
                        {t("priorityAnalysis.modal.strategicFit")}:
                      </strong>{" "}
                      {getStrategicAssessment(
                        selectedIdea.scores.strategicAlignment
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workshop Context */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🏗️ {t("priorityAnalysis.modal.workshopContext")}
                </h3>
                <p className="text-gray-700 text-sm">
                  {t("priorityAnalysis.modal.workshopDescription")}
                </p>
              </div>
            </div>
          )}
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
