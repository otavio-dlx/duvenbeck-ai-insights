import { describe, it, expect } from 'vitest';
import { DuvenbeckPriorityCalculator, type DuvenbeckScoringCriteria } from './priority-calculator';

describe('DuvenbeckPriorityCalculator', () => {

  it('should calculate priority with default weights', () => {
    const sampleScores: DuvenbeckScoringCriteria = {
      complexity: 4,       // High score = low complexity
      cost: 3,             // Medium score = medium cost
      roi: 5,              // High score = high ROI
      risk: 5,             // High score = low risk
      strategicAlignment: 4, // High score = good alignment
    };

    const result = DuvenbeckPriorityCalculator.calculatePriority(sampleScores);

    // Expected weighted score calculation:
    // Complexity: 4 * 20% = 0.8
    // Cost:       3 * 20% = 0.6
    // ROI:        5 * 25% = 1.25
    // Risk:       5 * 15% = 0.75
    // Strategic:  4 * 20% = 0.8
    // Total Weighted Score = 0.8 + 0.6 + 1.25 + 0.75 + 0.8 = 4.2
    const expectedWeightedScore = 4.2;

    // Expected final score (0-100 scale):
    // (4.2 / 5) * 100 = 84
    const expectedFinalScore = 84;

    expect(result.weightedScore).toBeCloseTo(expectedWeightedScore);
    expect(result.finalScore).toBe(expectedFinalScore);
    expect(result.category).toBe('Top Priority');
    expect(result.recommendations).toContain('🚀 Excellent candidate for immediate implementation');
  });

  it('should throw an error if weights do not sum to 100', () => {
    const sampleScores: DuvenbeckScoringCriteria = { complexity: 1, cost: 1, roi: 1, risk: 1, strategicAlignment: 1 };
    const invalidWeights = {
      complexity: 10,
      cost: 10,
      roi: 10,
      risk: 10,
      strategicAlignment: 10, // Sums to 50
    };

    expect(() => DuvenbeckPriorityCalculator.calculatePriority(sampleScores, invalidWeights)).toThrowError('Weights must sum to 100%, currently: 50%');
  });

  it('should correctly categorize a low-priority item', () => {
    const lowScores: DuvenbeckScoringCriteria = {
      complexity: 1,
      cost: 1,
      roi: 1,
      risk: 2,
      strategicAlignment: 1,
    };

    const result = DuvenbeckPriorityCalculator.calculatePriority(lowScores);

    // Weighted: (1*0.2) + (1*0.2) + (1*0.25) + (2*0.15) + (1*0.2) = 0.2 + 0.2 + 0.25 + 0.3 + 0.2 = 1.15
    // Final Score: (1.15 / 5) * 100 = 23
    expect(result.finalScore).toBe(23);
    expect(result.category).toBe('Low Priority');
    expect(result.recommendations).toContain('❌ Requires significant improvement before consideration');
  });

});
