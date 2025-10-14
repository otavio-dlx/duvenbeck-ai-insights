import { Header } from "@/components/Header";
import { InteractivePriorityCalculator } from "@/components/InteractivePriorityCalculator";
import { Button } from "@/components/ui/button";
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
                onClick={() => window.location.reload()}
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

        {/* Interactive Calculator */}
        <InteractivePriorityCalculator ideas={allIdeas} />

        {/* Usage Instructions */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              {t("priorityAnalysis.howToUse")}
            </h3>
            <p className="text-sm text-blue-700">
              {t("priorityAnalysis.instructions")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
