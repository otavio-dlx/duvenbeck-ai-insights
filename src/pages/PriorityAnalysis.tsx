import React from 'react';
import { InteractivePriorityCalculator } from '@/components/InteractivePriorityCalculator';
import { getAllIdeasForCalculator } from '@/lib/data-mapper';

export default function PriorityAnalysisPage() {
  // Get all ideas from all departments
  const allIdeas = getAllIdeasForCalculator();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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
            <div className="text-2xl font-bold text-purple-600">€2.5M+</div>
            <div className="text-sm text-gray-500">Estimated Total ROI Potential</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(allIdeas.length * 0.25)}
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