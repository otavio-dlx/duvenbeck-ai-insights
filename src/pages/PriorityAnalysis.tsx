import React from 'react';
import { Link } from 'react-router-dom';
import { InteractivePriorityCalculator } from '@/components/InteractivePriorityCalculator';
import { getAllIdeasForCalculator } from '@/lib/data-mapper';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Home, Calculator, Info } from 'lucide-react';

export default function PriorityAnalysisPage() {
  // Get all ideas from all departments
  const allIdeas = getAllIdeasForCalculator();

  // Calculate estimated total ROI potential based on scoring
  const calculateEstimatedROI = (ideas: typeof allIdeas): string => {
    const totalROI = ideas.reduce((sum, idea) => {
      // Convert ROI score to estimated value
      // ROI Scale: 5 = €100k+, 4 = €50-100k, 3 = €25-50k, 2 = €10-25k, 1 = <€10k
      const roiValue = idea.scores.roi >= 5 ? 100000 :
                      idea.scores.roi >= 4 ? 75000 :
                      idea.scores.roi >= 3 ? 37500 :
                      idea.scores.roi >= 2 ? 17500 :
                      5000;
      return sum + roiValue;
    }, 0);

    // Format as millions with 1 decimal place
    const millions = totalROI / 1000000;
    return `€${millions.toFixed(1)}M`;
  };

  // Calculate high priority initiatives (ROI >= 4 and strategic alignment >= 4)
  const calculateHighPriorityCount = (ideas: typeof allIdeas): number => {
    return ideas.filter(idea => 
      idea.scores.roi >= 4 && idea.scores.strategicAlignment >= 4
    ).length;
  };

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
              <Link to="/" className="hover:text-gray-700 flex items-center gap-1">
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
            AI Priority Analysis Dashboard
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Interactive priority calculator based on the official Duvenbeck scoring matrix. 
            Adjust weighting criteria to perform sensitivity analysis and identify the most 
            strategic AI initiatives across all departments.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{allIdeas.length}</div>
            <div className="text-sm text-gray-500">Total AI Initiatives</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {new Set(allIdeas.map(idea => idea.department)).size}
            </div>
            <div className="text-sm text-gray-500">Departments Analyzed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-purple-600">{calculateEstimatedROI(allIdeas)}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Calculated from ROI scores: 5=€100k+, 4=€50-100k, 3=€25-50k, 2=€10-25k, 1=&lt;€10k per initiative
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm text-gray-500">Estimated Total ROI Potential</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-orange-600">
                {calculateHighPriorityCount(allIdeas)}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Initiatives with ROI ≥ 4 and Strategic Alignment ≥ 4 (high business value + strategic fit)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm text-gray-500">High Priority Initiatives</div>
          </div>
        </div>

        {/* Interactive Calculator */}
        <InteractivePriorityCalculator ideas={allIdeas} />

        {/* CIO Insights Panel */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Executive Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Key Recommendations</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Focus on top 10 initiatives for maximum impact</li>
                  <li>• Prioritize quick wins for immediate ROI demonstration</li>
                  <li>• Consider department synergies for cost optimization</li>
                  <li>• Balance innovation with risk tolerance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Strategic Considerations</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Align investments with 2024-2026 strategic plan</li>
                  <li>• Ensure sufficient budget allocation for top priorities</li>
                  <li>• Plan phased implementation to manage change</li>
                  <li>• Monitor regulatory compliance for all initiatives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}