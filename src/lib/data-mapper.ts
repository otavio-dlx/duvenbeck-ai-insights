import { getIdeasFor, getLocalizedString, listDataKeys } from "@/lib/data";
import { DuvenbeckScoringCriteria } from "@/lib/priority-calculator";
import { NewFormatIdea } from "@/types/ideas";

// Helper functions to convert existing data to priority calculator format

export function mapIdeaToScoringCriteria(
  idea: NewFormatIdea
): DuvenbeckScoringCriteria {
  return {
    complexity: idea.complexity || 3,
    cost: idea.cost || 3,
    roi: idea.roi || 3,
    risk: idea.risk || 3,
    strategicAlignment: idea.strategicAlignment || 3,
  };
}

export function enhanceIdeasForPriorityCalculator(
  ideas: Record<string, unknown>,
  departmentName: string
) {
  // Handle both array format and nested object format
  const ideasArray = Array.isArray(ideas)
    ? ideas
    : (ideas?.ideas as NewFormatIdea[]) || [];

  return ideasArray.map((idea: NewFormatIdea, index: number) => ({
    id: idea.ideaKey || `${departmentName}_${index}`,
    name: getLocalizedString(idea.ideaKey) || `Initiative ${index + 1}`,
    description: getLocalizedString(idea.problemKey) || "AI Initiative",
    department: departmentName,
    scores: mapIdeaToScoringCriteria(idea),
  }));
}

// Convert department data files to calculator format
export async function getAllIdeasForCalculator() {
  try {
    const dataKeys = await listDataKeys();
    // Filter out non-department files like 'types' and 'participants'
    const departmentKeys = dataKeys.filter(
      (key) => !["types", "participants"].includes(key)
    );

    const allIdeas: Array<{
      id: string;
      name: string;
      description: string;
      department: string;
      scores: DuvenbeckScoringCriteria;
    }> = [];

    await Promise.all(
      departmentKeys.map(async (key) => {
        try {
          const departmentData = await getIdeasFor(key);
          if (departmentData?.ideas && Array.isArray(departmentData.ideas)) {
            // Get the actual department name from the data instead of formatting the key
            const actualDepartmentName = departmentData.home?.[0]?.department;
            const departmentName =
              actualDepartmentName || formatDepartmentName(key);

            const ideas = departmentData.ideas as NewFormatIdea[];

            const enhancedIdeas = ideas.map(
              (idea: NewFormatIdea, index: number) => ({
                id: idea.ideaKey || `${key}_${index}`,
                name:
                  getLocalizedString(idea.ideaKey) || `Initiative ${index + 1}`,
                description:
                  getLocalizedString(idea.problemKey) ||
                  getLocalizedString(idea.solutionKey) ||
                  "AI Initiative",
                department: departmentName,
                scores: mapIdeaToScoringCriteria(idea),
              })
            );

            allIdeas.push(...enhancedIdeas);
          }
        } catch (error) {
          console.warn(`Failed to load data for department ${key}:`, error);
        }
      })
    );

    return allIdeas;
  } catch (error) {
    console.error("Failed to load ideas for calculator:", error);
    // Return empty array as fallback
    return [];
  }
}

// Helper function to format department names
function formatDepartmentName(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
