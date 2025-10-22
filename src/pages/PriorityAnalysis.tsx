import { Header } from "@/components/Header";
import { InteractivePriorityCalculator } from "@/components/InteractivePriorityCalculator";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import { useTagging } from "@/hooks/useTagging";
import { getAllIdeasForCalculator } from "@/lib/data-mapper";
import { DuvenbeckScoringCriteria } from "@/lib/priority-calculator";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Idea {
  id: string;
  name: string;
  description: string;
  department: string;
  scores: DuvenbeckScoringCriteria;
}

export default function PriorityAnalysisPage() {
  const { t } = useTranslation();
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Keep filters independent per page but reuse the filter logic
  const { selectedDepartment, setSelectedDepartment, filterIdeas } =
    useFilters();
  const { taggedIdeas } = useTagging();
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Derive tag list from taggedIdeas (fallback to empty)
  const tags = Array.from(
    new Set(taggedIdeas.flatMap((t) => t.tags.map((tg) => tg.text)))
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true);
        const ideas = await getAllIdeasForCalculator();
        setAllIdeas(ideas);
      } catch (err) {
        console.error("Failed to load ideas:", err);
        setError("Failed to load ideas");
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <main className="container py-6 space-y-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t("priorityAnalysis.loading")}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <main className="container py-6 space-y-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={() => globalThis.location.reload()}
                className="mt-4"
                variant="outline"
              >
                {t("priorityAnalysis.retry")}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Compute unique department list from loaded ideas
  const departments = Array.from(
    new Set(allIdeas.map((idea) => idea.department))
  ).sort((a, b) => a.localeCompare(b));

  // Filter ideas by selected department using shared logic
  let filteredIdeas = filterIdeas(allIdeas);

  // If a tag is selected, further filter by ideas that have that tag (use tagging context)
  if (selectedTag && selectedTag !== "all") {
    filteredIdeas = filteredIdeas.filter((idea) => {
      // idea.description is used as ideaText when tags were created elsewhere in the app
      const candidates = new Set(
        [idea.name, idea.description]
          .filter(Boolean)
          .map((s) => String(s).trim())
      );
      const record = taggedIdeas.find((t) =>
        candidates.has(String(t.ideaText).trim())
      );
      if (!record) return false;
      return record.tags.some((tg) => tg.text === selectedTag);
    });
  }

  const handleReset = () => {
    setSelectedDepartment("all");
    setSelectedTag("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="container py-6 space-y-6">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("priorityAnalysis.backToDashboard")}
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("priorityAnalysis.title")}
          </h1>
          <p className="text-muted-foreground max-w-4xl">
            {t("priorityAnalysis.subtitle")}
          </p>
        </div>

        {/* Interactive Calculator with Department Filter */}
        <InteractivePriorityCalculator
          ideas={filteredIdeas}
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
