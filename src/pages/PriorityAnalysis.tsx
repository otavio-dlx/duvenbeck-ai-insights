import { InteractivePriorityCalculator } from "@/components/InteractivePriorityCalculator";
import { Button } from "@/components/ui/button";
import { getAllIdeasForCalculator } from "@/lib/data-mapper";
import { ArrowLeft, Calculator, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function PriorityAnalysisPage() {
  // Get all ideas from all departments
  const allIdeas = getAllIdeasForCalculator();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500">
              <Link
                to="/"
                className="hover:text-gray-700 flex items-center gap-1 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                Priority Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Priority Calculator
          </h1>
          <p className="text-gray-600 max-w-4xl">
            Interactive priority calculator based on the official Duvenbeck
            scoring matrix. Adjust weighting criteria to perform sensitivity
            analysis and identify the most strategic AI initiatives across all
            departments.
          </p>
        </div>

        {/* Interactive Calculator */}
        <InteractivePriorityCalculator ideas={allIdeas} />

        {/* Usage Instructions */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              How to Use the Calculator
            </h3>
            <p className="text-sm text-blue-700">
              Adjust the weighting sliders above to reflect your strategic
              priorities. The ranking will update automatically to show which
              initiatives align best with your chosen criteria. Use the scenario
              buttons for common prioritization approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
