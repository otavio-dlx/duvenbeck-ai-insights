import { TagCategory } from "@/contexts/TaggingContext";

export const TAG_CATEGORY_INFO = {
  technical: {
    color: "blue",
    label: "Technical",
    description: "Technology, development, and system-related aspects",
  },
  business: {
    color: "green",
    label: "Business",
    description: "Business strategy, revenue, and market-related aspects",
  },
  process: {
    color: "orange",
    label: "Process",
    description: "Operational processes, workflows, and organizational aspects",
  },
} as const;

export function getTagCategoryInfo(category: TagCategory) {
  return TAG_CATEGORY_INFO[category];
}
