import { useTranslation } from "react-i18next";

// Import all department data
import * as accountingData from "@/data/accounting";
import * as centralSolutionDesignData from "@/data/central_solution_design";
import * as complianceData from "@/data/compliance";
import * as contractLogisticsData from "@/data/contract_logistics";
import * as controllingData from "@/data/controlling";
import * as corpDevData from "@/data/corp_dev";
import * as esgData from "@/data/esg";
import * as hrData from "@/data/hr";
import * as itBusinessSolutionRoadData from "@/data/it_business_solution_road";
import * as itPlatformServicesData from "@/data/it_plataform_services_digital_workplace";
import * as itSharedServicesData from "@/data/it_shared_services";
import * as marketingCommunicationsData from "@/data/marketing_communications";
import * as qehsData from "@/data/qehs";
import * as roadSalesData from "@/data/road_sales";
import * as strategicKamData from "@/data/strategic_kam";
import { NewFormatIdea } from "@/types/ideas";

export interface ProcessedWorkshopData {
  departments: string[];
  totalIdeas: number;
  summary: string;
  departmentSummaries: { [key: string]: DepartmentSummary };
}

export interface DepartmentSummary {
  name: string;
  totalIdeas: number;
  topPriorityIdeas: ProcessedIdea[];
  topics: string[];
  owners: string[];
}

export interface ProcessedIdea {
  title: string;
  problem: string;
  solution: string;
  owner: string;
  priority: string;
  finalPrio: string | number;
  complexity: number;
  cost?: number;
  roi?: number;
  risk?: number;
  strategicAlignment?: number;
}

const departmentDataSources = {
  Accounting: accountingData,
  "Central Solution Design": centralSolutionDesignData,
  Compliance: complianceData,
  "Contract Logistics": contractLogisticsData,
  Controlling: controllingData,
  "Corporate Development": corpDevData,
  ESG: esgData,
  HR: hrData,
  IT: {
    ideas: [
      ...(itBusinessSolutionRoadData.ideas.ideas || []),
      ...(itPlatformServicesData.ideas.ideas || []),
      ...(itSharedServicesData.ideas.ideas || []),
    ],
  },
  "Marketing Communications": marketingCommunicationsData,
  QEHS: qehsData,
  "Road Sales": roadSalesData,
  "Strategic KAM": strategicKamData,
};

export const useWorkshopDataProcessor = () => {
  const { t } = useTranslation();

  const getTranslatedText = (key: string): string => {
    try {
      return t(key);
    } catch {
      return key; // Return the key if translation fails
    }
  };

  const processIdea = (idea: NewFormatIdea): ProcessedIdea => {
    return {
      title: getTranslatedText(idea.ideaKey),
      problem: getTranslatedText(idea.problemKey),
      solution: getTranslatedText(idea.solutionKey),
      owner: idea.owner,
      priority: idea.priority,
      finalPrio: idea.finalPrio,
      complexity: idea.complexity,
      cost: idea.cost,
      roi: idea.roi,
      risk: idea.risk,
      strategicAlignment: idea.strategicAlignment,
    };
  };

  const processDepartmentData = (
    departmentName: string,
    data: unknown
  ): DepartmentSummary => {
    const dataObj = data as { ideas?: NewFormatIdea[] };
    const ideas = dataObj.ideas || [];
    const processedIdeas = ideas.map((idea: NewFormatIdea) =>
      processIdea(idea)
    );

    // Get top 3 priority ideas (lowest finalPrio numbers are highest priority)
    const topPriorityIdeas = processedIdeas
      .sort((a, b) => {
        const aPrio =
          typeof a.finalPrio === "number"
            ? a.finalPrio
            : parseInt(String(a.finalPrio)) || 999;
        const bPrio =
          typeof b.finalPrio === "number"
            ? b.finalPrio
            : parseInt(String(b.finalPrio)) || 999;
        return aPrio - bPrio;
      })
      .slice(0, 3);

    // Extract unique topics from titles (simplified)
    const topics: string[] = [
      ...new Set(
        processedIdeas
          .map(
            (idea) => idea.title.split(" ").slice(0, 2).join(" ") // Take first 2 words as topic
          )
          .filter((topic): topic is string => typeof topic === "string")
      ),
    ];

    // Extract unique owners
    const owners: string[] = [
      ...new Set(
        processedIdeas
          .map((idea) => idea.owner)
          .filter((owner): owner is string => typeof owner === "string")
      ),
    ];

    return {
      name: departmentName,
      totalIdeas: processedIdeas.length,
      topPriorityIdeas,
      topics,
      owners,
    };
  };

  const processAllWorkshopData = (): ProcessedWorkshopData => {
    const departmentSummaries: { [key: string]: DepartmentSummary } = {};
    let totalIdeas = 0;

    // Process each department
    Object.entries(departmentDataSources).forEach(([departmentName, data]) => {
      const summary = processDepartmentData(departmentName, data);
      departmentSummaries[departmentName] = summary;
      totalIdeas += summary.totalIdeas;
    });

    const departments = Object.keys(departmentSummaries);

    // Create a high-level summary
    const summary = `Duvenbeck AI Workshop Data Summary:
- Total Departments: ${departments.length}
- Total Ideas: ${totalIdeas}
- Departments: ${departments.join(", ")}
- Focus Areas: Innovation, Process Optimization, Digital Transformation, Compliance, and Strategic Development`;

    return {
      departments,
      totalIdeas,
      summary,
      departmentSummaries,
    };
  };

  const createChatContext = (processedData: ProcessedWorkshopData): string => {
    let context = `${processedData.summary}\n\n`;

    context += "Department Details:\n";
    Object.values(processedData.departmentSummaries).forEach((dept) => {
      context += `\n${dept.name} (${dept.totalIdeas} ideas):\n`;
      context += `Top Priorities:\n`;
      dept.topPriorityIdeas.forEach((idea, index) => {
        context += `${index + 1}. ${idea.title} (Priority: ${
          idea.priority
        }, Owner: ${idea.owner})\n`;
        context += `   Problem: ${idea.problem}\n`;
        context += `   Solution: ${idea.solution}\n`;
      });
      context += `Key Topics: ${dept.topics.join(", ")}\n`;
      context += `Team Members: ${dept.owners.join(", ")}\n`;
    });

    return context;
  };

  const sanitizeUserInput = (input: string): string => {
    // Remove potential injection attempts
    return input
      .replace(/[<>]/g, "") // Remove HTML tags
      .replace(/javascript:/gi, "") // Remove javascript:
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
      .slice(0, 500); // Limit length
  };

  return {
    processAllWorkshopData,
    createChatContext,
    sanitizeUserInput,
    getTranslatedText,
  };
};

export default useWorkshopDataProcessor;
