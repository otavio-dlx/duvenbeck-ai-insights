// Duvenbeck AI Priority Calculator
// Based on the official scoring matrix used in workshops
// Allows real-time weight adjustment for sensitivity analysis

export interface DuvenbeckScoringCriteria {
  complexity: number;      // 1-5 (5 = trivial, 1 = highly complex) - Technical, operational, and organizational difficulty
  cost: number;           // 1-5 (5 = low <€500, 1 = very high >€50k/year) - Total financial and human effort  
  roi: number;            // 1-5 (5 = €100k+ revenue or >15% productivity, 1 = minimal gains) - Total expected benefits
  risk: number;           // 1-5 (5 = low risk, 1 = high risk) - Probability of project failure or negative impact
  strategicAlignment: number; // 1-5 (5 = top strategic goals, 1 = marginally related) - Support for Duvenbeck's strategy
}

export interface WeightingConfig {
  complexity: number;        // Default: 20%
  cost: number;             // Default: 20%
  roi: number;              // Default: 25%
  risk: number;             // Default: 15%
  strategicAlignment: number; // Default: 20%
}

export interface PriorityResult {
  finalScore: number;               // 0-100 scale
  weightedScore: number;            // Raw weighted score before scaling
  rank: number;                     // 1-N ranking
  category: 'Top Priority' | 'High Priority' | 'Medium Priority' | 'Low Priority';
  breakdown: {
    complexity: { score: number; weighted: number; };
    cost: { score: number; weighted: number; };
    roi: { score: number; weighted: number; };
    risk: { score: number; weighted: number; };
    strategicAlignment: { score: number; weighted: number; };
  };
  recommendations: string[];
}

export interface ScoringGuidelines {
  complexity: {
    5: "Internal proof-of-concept using standard tools (trivial complexity)";
    4: "Standard implementation with minimal dependencies";
    3: "Moderate technical/operational complexity";
    2: "Complex with multiple system integrations";
    1: "Multiple legacy systems, missing data, or dependencies on external partners (highly complex)";
  };
  cost: {
    5: "Very small internal proof-of-concept <€500";
    4: "Small project €500-€5,000";
    3: "Medium project €5,000-€20,000";
    2: "Large project €20,000-€50,000";
    1: "Recurring subscription costs >€50,000/year or very high implementation cost";
  };
  roi: {
    5: "€100,000+ revenue or >15% productivity improvement";
    4: "€50,000-€100,000 revenue or 10-15% productivity improvement";
    3: "€20,000-€50,000 revenue or 5-10% productivity improvement";
    2: "€5,000-€20,000 revenue or 2-5% productivity improvement";
    1: "Minimal quantifiable gains - intangible outcomes score based on estimated business impact";
  };
  risk: {
    5: "Low-risk internal POC with no sensitive data or regulatory concerns";
    4: "Low risk with standard business processes";
    3: "Medium risk with some process changes required";
    2: "Higher risk with significant system or organizational changes";
    1: "Projects touching sensitive data or regulatory compliance (high risk)";
  };
  strategicAlignment: {
    5: "Project contributes to top strategic goals (e.g., cost reduction in logistics operations)";
    4: "Strong alignment with key business objectives";
    3: "Moderate alignment with business strategy";
    2: "Limited strategic connection";
    1: "Only marginally related to strategic priorities";
  };
}

export class DuvenbeckPriorityCalculator {
  
  // Default weights based on Duvenbeck's scoring matrix
  public static readonly DEFAULT_WEIGHTS: WeightingConfig = {
    complexity: 20,        // 20%
    cost: 20,             // 20%
    roi: 25,              // 25%
    risk: 15,             // 15%
    strategicAlignment: 20 // 20%
  };

  // Scoring guidelines for reference - Based on official Duvenbeck workshop criteria
  public static readonly SCORING_GUIDELINES: ScoringGuidelines = {
    complexity: {
      5: "Internal proof-of-concept using standard tools (trivial complexity)",
      4: "Standard implementation with minimal dependencies",
      3: "Moderate technical/operational complexity",
      2: "Complex with multiple system integrations",
      1: "Multiple legacy systems, missing data, or dependencies on external partners (highly complex)"
    },
    cost: {
      5: "Very small internal proof-of-concept <€500",
      4: "Small project €500-€5,000",
      3: "Medium project €5,000-€20,000", 
      2: "Large project €20,000-€50,000",
      1: "Recurring subscription costs >€50,000/year or very high implementation cost"
    },
    roi: {
      5: "€100,000+ revenue or >15% productivity improvement",
      4: "€50,000-€100,000 revenue or 10-15% productivity improvement",
      3: "€20,000-€50,000 revenue or 5-10% productivity improvement",
      2: "€5,000-€20,000 revenue or 2-5% productivity improvement",
      1: "Minimal quantifiable gains - intangible outcomes score based on estimated business impact"
    },
    risk: {
      5: "Low-risk internal POC with no sensitive data or regulatory concerns",
      4: "Low risk with standard business processes",
      3: "Medium risk with some process changes required",
      2: "Higher risk with significant system or organizational changes",
      1: "Projects touching sensitive data or regulatory compliance (high risk)"
    },
    strategicAlignment: {
      5: "Project contributes to top strategic goals (e.g., cost reduction in logistics operations)",
      4: "Strong alignment with key business objectives",
      3: "Moderate alignment with business strategy",
      2: "Limited strategic connection",
      1: "Only marginally related to strategic priorities"
    }
  };

  static calculatePriority(
    scores: DuvenbeckScoringCriteria, 
    weights: WeightingConfig = this.DEFAULT_WEIGHTS
  ): PriorityResult {
    
    // Validate that weights sum to 100
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      throw new Error(`Weights must sum to 100%, currently: ${totalWeight}%`);
    }

    // Calculate weighted scores for each criterion
    const breakdown = {
      complexity: {
        score: scores.complexity,
        weighted: (scores.complexity * weights.complexity) / 100
      },
      cost: {
        score: scores.cost,
        weighted: (scores.cost * weights.cost) / 100
      },
      roi: {
        score: scores.roi,
        weighted: (scores.roi * weights.roi) / 100
      },
      risk: {
        score: scores.risk,
        weighted: (scores.risk * weights.risk) / 100
      },
      strategicAlignment: {
        score: scores.strategicAlignment,
        weighted: (scores.strategicAlignment * weights.strategicAlignment) / 100
      }
    };

    // Calculate total weighted score (0-5 scale)
    const weightedScore = Object.values(breakdown).reduce((sum, item) => sum + item.weighted, 0);
    
    // Convert to 0-100 scale for easier interpretation
    const finalScore = Math.round((weightedScore / 5) * 100);

    // Categorize the initiative
    const category = this.categorizeInitiative(finalScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(scores, finalScore, weights);

    return {
      finalScore,
      weightedScore,
      rank: 0, // Will be set when ranking multiple ideas
      category,
      breakdown,
      recommendations
    };
  }

  private static categorizeInitiative(score: number): PriorityResult['category'] {
    if (score >= 80) return 'Top Priority';
    if (score >= 65) return 'High Priority';
    if (score >= 45) return 'Medium Priority';
    return 'Low Priority';
  }

  private static generateRecommendations(
    scores: DuvenbeckScoringCriteria, 
    finalScore: number,
    weights: WeightingConfig
  ): string[] {
    const recommendations: string[] = [];

    // Overall recommendations based on final score
    if (finalScore >= 80) {
      recommendations.push("🚀 Excellent candidate for immediate implementation");
    } else if (finalScore >= 65) {
      recommendations.push("✅ Strong candidate for next planning cycle");
    } else if (finalScore >= 45) {
      recommendations.push("⏳ Consider for future roadmap when resources available");
    } else {
      recommendations.push("❌ Requires significant improvement before consideration");
    }

    // Specific improvement suggestions based on low scores
    if (scores.complexity <= 2) {
      recommendations.push("🔧 High complexity detected - consider breaking into smaller phases or proof-of-concept first");
    }
    
    if (scores.cost <= 2) {
      recommendations.push("💰 High cost concern - explore cost optimization or alternative approaches");
    }
    
    if (scores.roi <= 2) {
      recommendations.push("📈 Low ROI - reassess business case or look for additional value streams");
    }
    
    if (scores.risk <= 2) {
      recommendations.push("⚠️ High risk identified - develop comprehensive risk mitigation strategy");
    }
    
    if (scores.strategicAlignment <= 2) {
      recommendations.push("🎯 Limited strategic alignment - clarify connection to business objectives");
    }

    // Weight-specific insights
    const highestWeightCriterion = Object.entries(weights).reduce((max, [key, value]) => 
      value > max.value ? { key, value } : max, { key: '', value: 0 }
    );

    const criterionScore = scores[highestWeightCriterion.key as keyof DuvenbeckScoringCriteria];
    if (criterionScore <= 2) {
      recommendations.push(`⚡ Focus on improving ${highestWeightCriterion.key} (highest weighted criterion)`);
    }

    return recommendations;
  }

  // Rank multiple ideas and assign ranks
  static rankIdeas(
    ideas: Array<{ id: string; name: string; scores: DuvenbeckScoringCriteria }>,
    weights: WeightingConfig = this.DEFAULT_WEIGHTS
  ): Array<PriorityResult & { id: string; name: string }> {
    
    const results = ideas.map(idea => ({
      id: idea.id,
      name: idea.name,
      ...this.calculatePriority(idea.scores, weights)
    }));

    // Sort by final score (descending) and assign ranks
    results.sort((a, b) => b.finalScore - a.finalScore);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return results;
  }

  // Sensitivity analysis - show how rankings change with different weights
  static performSensitivityAnalysis(
    ideas: Array<{ id: string; name: string; scores: DuvenbeckScoringCriteria }>,
    weightScenarios: Array<{ name: string; weights: WeightingConfig }>
  ) {
    return weightScenarios.map(scenario => ({
      scenarioName: scenario.name,
      rankings: this.rankIdeas(ideas, scenario.weights)
    }));
  }

  // Validate scores are within acceptable range (1-5)
  static validateScores(scores: DuvenbeckScoringCriteria): boolean {
    return Object.values(scores).every(score => score >= 1 && score <= 5);
  }

  // Generate predefined weight scenarios for CIO analysis
  static getWeightScenarios(): Array<{ name: string; weights: WeightingConfig; description: string }> {
    return [
      {
        name: "Default (Balanced)",
        weights: this.DEFAULT_WEIGHTS,
        description: "Standard Duvenbeck scoring with balanced criteria"
      },
      {
        name: "ROI Focused",
        weights: { complexity: 15, cost: 15, roi: 40, risk: 15, strategicAlignment: 15 },
        description: "Prioritizes financial returns above all other factors"
      },
      {
        name: "Strategic Focused", 
        weights: { complexity: 10, cost: 15, roi: 20, risk: 15, strategicAlignment: 40 },
        description: "Emphasizes strategic alignment with business goals"
      },
      {
        name: "Quick Wins",
        weights: { complexity: 35, cost: 25, roi: 20, risk: 10, strategicAlignment: 10 },
        description: "Favors easy-to-implement, low-cost initiatives"
      },
      {
        name: "Conservative",
        weights: { complexity: 15, cost: 20, roi: 20, risk: 35, strategicAlignment: 10 },
        description: "Risk-averse approach prioritizing low-risk initiatives"
      },
      {
        name: "Innovation First",
        weights: { complexity: 10, cost: 10, roi: 15, risk: 25, strategicAlignment: 40 },
        description: "Accepts higher risk for strategic innovation opportunities"
      }
    ];
  }
}

// Export for use in components
export { DuvenbeckPriorityCalculator as PriorityCalculator };
