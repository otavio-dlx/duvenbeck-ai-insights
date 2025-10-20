import { getIdeasFor, listDataKeys } from "@/lib/data";
import { describe, expect, it } from "vitest";

describe("Department Count", () => {
  it("should count exactly 13 departments with valid collaboard data", async () => {
    // Use the same logic as DynamicCollaboards to count valid departments
    const keys = await listDataKeys();
    const validDepartments: string[] = [];

    for (const k of keys) {
      try {
        const data = await getIdeasFor(k);
        if (!data) continue;

        // Look for the 'home' array in the data structure
        const home = data.home;
        if (!Array.isArray(home) || home.length === 0) continue;

        const homeData = home[0];
        if (homeData && typeof homeData === "object" && homeData !== null) {
          const homeRecord = homeData as Record<string, unknown>;
          const collaboardLink = homeRecord.collaboardLink;
          const department = homeRecord.department;

          if (
            typeof collaboardLink === "string" &&
            collaboardLink.startsWith("http")
          ) {
            const deptName =
              typeof department === "string"
                ? department
                : formatDepartmentName(k);
            validDepartments.push(deptName);
          }
        }
      } catch (err) {
        console.warn(`Failed to read dataset ${k}:`, err);
      }
    }

    // Deduplicate by department name (same as DynamicCollaboards)
    const uniqueDepartments = new Map<string, string>();
    validDepartments.forEach((dept) => {
      if (!uniqueDepartments.has(dept)) {
        uniqueDepartments.set(dept, dept);
      }
    });

    const finalCount = uniqueDepartments.size;

    console.log(
      "Valid departments found:",
      Array.from(uniqueDepartments.keys()).sort()
    );
    console.log("Total department count:", finalCount);

    // This should be 13 according to the user
    expect(finalCount).toBe(13);
  });

  it("should list all data keys excluding non-department files", async () => {
    const keys = await listDataKeys();
    const filteredKeys = keys.filter(
      (key) => !["participants", "types"].includes(key)
    );

    console.log("All data keys:", keys.sort());
    console.log(
      "Department keys (excluding participants, types):",
      filteredKeys.sort()
    );
    console.log("Total file count:", keys.length);
    console.log("Department file count:", filteredKeys.length);

    // This might be 15, but not all have valid collaboard data
    expect(filteredKeys.length).toBeGreaterThan(0);
  });
});

// Helper function copied from DynamicCollaboards
function formatDepartmentName(key: string): string {
  const nameMap: Record<string, string> = {
    accounting: "Accounting",
    central_solution_design: "Central Solution Design",
    compliance: "Compliance",
    contract_logistics: "Contract Logistics",
    controlling: "Controlling",
    corp_dev: "Corporate Development",
    esg: "Environmental, Social & Governance",
    hr: "Human Resources",
    it_business_solution_road: "IT",
    it_plataform_services_digital_workplace: "IT",
    it_shared_services: "IT",
    marketing_communications: "Marketing & Communications",
    qehs: "Quality, Environment, Health & Safety",
    road_sales: "Road Sales",
    strategic_kam: "Strategic Key Account Management",
  };
  return (
    nameMap[key] ||
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
