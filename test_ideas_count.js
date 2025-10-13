// Simple test to verify ideas counting
import { ideas as complianceIdeas } from "./src/data/compliance.ts";
import { ideas as hrIdeas } from "./src/data/hr.ts";

console.log("Compliance ideas count:", complianceIdeas.ideas.length);
console.log("HR ideas count:", hrIdeas.ideas.length);

// Test the structure
console.log("Compliance structure:", Object.keys(complianceIdeas));
console.log(
  "First compliance idea has ideaKey:",
  !!complianceIdeas.ideas[0].ideaKey
);
