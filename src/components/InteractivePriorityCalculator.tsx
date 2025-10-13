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
}: InteractivePriorityCalculatorProps) {
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
    const csvContent = [
      [
        "Rank",
        "Idea",
        "Department",
        "Final Score",
        "Category",
        "Complexity",
        "Cost",
        "ROI",
        "Risk",
        "Strategic Alignment",
      ].join(","),
      ...currentRankings.map((result) =>
        [
          result.rank,
          `"${result.name}"`,
          ideas.find((idea) => idea.id === result.id)?.department || "",
          result.finalScore,
          result.category,
          result.breakdown.complexity.score,
          result.breakdown.cost.score,
          result.breakdown.roi.score,
          result.breakdown.risk.score,
          result.breakdown.strategicAlignment.score,
        ].join(",")
      ),
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
            <span>Interactive Priority Calculator</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetWeights}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Adjust weighting criteria to see how AI initiative priorities change
            in real-time. Based on the official Duvenbeck scoring matrix.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Weight Configuration</CardTitle>
              <CardDescription>
                Total: {Math.round(totalWeight)}%
                {Math.abs(totalWeight - 100) > 0.1 && (
                  <Badge variant="destructive" className="ml-2">
                    Must equal 100%
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scenario Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Predefined Scenarios
                </label>
                <Select
                  value={selectedScenario}
                  onValueChange={handleScenarioChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Weights</SelectItem>
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
                Rankings
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="cursor-pointer">
                Detailed Breakdown
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="cursor-pointer">
                Scenario Comparison
              </TabsTrigger>
            </TabsList>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
              <Card>
                <CardHeader>
                  <CardTitle>Priority Rankings</CardTitle>
                  <CardDescription>
                    Ideas ranked by current weighting configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>AI Initiative</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="w-12">Change</TableHead>
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
                                  {result.name}
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </div>
                                {idea?.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-2">
                                    {idea.description}
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
                                {result.category}
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
                  <CardTitle>Detailed Scoring Breakdown</CardTitle>
                  <CardDescription>
                    Individual criterion scores and weighted contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Initiative</TableHead>
                        <TableHead>Complexity</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Strategic</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRankings.slice(0, 10).map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.name}
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
                                {Math.round(result.breakdown.roi.weighted * 20)}
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
                                  result.breakdown.strategicAlignment.weighted *
                                    20
                                )}
                                )
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{result.finalScore}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
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
                  {selectedIdea?.name || "AI Initiative"}
                </div>
                <div className="text-sm text-muted-foreground font-normal mt-1">
                  {selectedIdea?.department} • Priority Calculator Analysis
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
                    🏢 Source Department
                  </h3>
                  <p className="text-blue-800 font-medium">
                    {selectedIdea.department}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Originating Business Unit
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    👤 Initiative Owner
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
                  <p className="text-green-600 text-sm mt-1">Project Sponsor</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    📅 Submission Date
                  </h3>
                  <p className="text-purple-800 font-medium">
                    October 6-8, 2025
                  </p>
                  <p className="text-purple-600 text-sm mt-1">
                    AI Workshop Session
                  </p>
                </div>
              </div>

              {/* Original Problem & Solution */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">
                  🎯 Problem & Solution Definition
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      Problem Statement:
                    </h4>
                    <p className="text-yellow-800 text-sm">
                      {selectedIdea.description.split(".")[0]}.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      Proposed AI Solution:
                    </h4>
                    <p className="text-yellow-800 text-sm">
                      {selectedIdea.description.includes("AI")
                        ? selectedIdea.description
                        : `AI-powered ${selectedIdea.name.toLowerCase()} utilizing machine learning algorithms to automate and optimize the identified processes.`}
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
                          Technical Complexity
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-blue-100">
                        {selectedIdea.scores.complexity}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Assessment:</strong>{" "}
                      {selectedIdea.scores.complexity >= 4
                        ? "Low complexity - can leverage existing tools and infrastructure with minimal custom development."
                        : selectedIdea.scores.complexity >= 3
                        ? "Moderate complexity - requires some custom development but uses standard AI/ML approaches."
                        : selectedIdea.scores.complexity >= 2
                        ? "High complexity - requires significant custom development, integration challenges, or novel AI approaches."
                        : "Very high complexity - cutting-edge AI research required, significant technical risks and integration challenges."}
                    </div>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💰</span>
                        <span className="font-semibold">
                          Investment Required
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100">
                        {selectedIdea.scores.cost}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Estimated Investment:</strong>{" "}
                      {selectedIdea.scores.cost >= 4
                        ? "Low cost (< €50k) - primarily configuration and training costs."
                        : selectedIdea.scores.cost >= 3
                        ? "Moderate cost (€50k-200k) - includes software licenses, development, and implementation."
                        : selectedIdea.scores.cost >= 2
                        ? "High cost (€200k-500k) - significant development, infrastructure, and change management costs."
                        : "Very high cost (> €500k) - major enterprise-scale implementation with extensive customization."}
                    </div>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📈</span>
                        <span className="font-semibold">Expected ROI</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100">
                        {selectedIdea.scores.roi}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Business Impact:</strong>{" "}
                      {selectedIdea.scores.roi >= 5
                        ? "Exceptional ROI (€100k+ annually) - major process improvements, significant cost savings, or new revenue streams."
                        : selectedIdea.scores.roi >= 4
                        ? "High ROI (€50k-100k annually) - measurable efficiency gains and cost reductions."
                        : selectedIdea.scores.roi >= 3
                        ? "Moderate ROI (€25k-50k annually) - process improvements with quantifiable benefits."
                        : selectedIdea.scores.roi >= 2
                        ? "Low ROI (€10k-25k annually) - limited quantifiable benefits, mostly qualitative improvements."
                        : "Minimal ROI (< €10k annually) - primarily strategic or compliance-driven initiative."}
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-semibold">Risk Assessment</span>
                      </div>
                      <Badge variant="outline" className="bg-red-100">
                        {selectedIdea.scores.risk}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Risk Factors:</strong>{" "}
                      {selectedIdea.scores.risk >= 4
                        ? "Low risk - proven technology, clear implementation path, minimal business disruption."
                        : selectedIdea.scores.risk >= 3
                        ? "Moderate risk - standard implementation risks, manageable with proper planning."
                        : selectedIdea.scores.risk >= 2
                        ? "High risk - technical uncertainties, potential business disruption, or regulatory concerns."
                        : "Very high risk - unproven technology, significant business impact, or major compliance implications."}
                    </div>
                  </div>

                  <div className="border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span className="font-semibold">
                          Strategic Alignment
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-purple-100">
                        {selectedIdea.scores.strategicAlignment}/5
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong>Strategic Fit:</strong>{" "}
                      {selectedIdea.scores.strategicAlignment >= 4
                        ? "High alignment - directly supports key strategic objectives and digital transformation goals."
                        : selectedIdea.scores.strategicAlignment >= 3
                        ? "Moderate alignment - supports departmental goals and overall business strategy."
                        : selectedIdea.scores.strategicAlignment >= 2
                        ? "Low alignment - peripheral to main strategic objectives, primarily operational benefits."
                        : "Poor alignment - limited connection to strategic goals, primarily tactical initiative."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workshop Context */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🏗️ Workshop Context
                </h3>
                <p className="text-gray-700 text-sm">
                  This initiative was identified during Duvenbeck's AI Workshop
                  sessions (October 6-8, 2025) where department heads and key
                  stakeholders collaborated to identify AI opportunities across
                  the organization. The scoring reflects collective assessment
                  by domain experts and strategic leadership.
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
}: {
  ideas: InteractivePriorityCalculatorProps["ideas"];
}) {
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
  }, [ideas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Comparison</CardTitle>
        <CardDescription>
          Compare top 5 initiatives across different weighting scenarios
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
                {scenario.rankings.map((result, index) => (
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
                      {result.name}
                    </span>
                    <Badge variant="secondary">{result.finalScore}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
