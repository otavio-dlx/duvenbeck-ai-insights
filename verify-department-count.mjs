import { listDataKeys, getIdeasFor } from '../src/lib/data.js';

// Helper function to format department names (same as in DynamicCollaboards)
const formatDepartmentName = (key) => {
  const nameMap = {
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
};

async function countDepartments() {
  try {
    const keys = await listDataKeys();
    console.log('All data keys:', keys);
    
    const validDepartments = [];

    for (const k of keys) {
      try {
        const data = await getIdeasFor(k);
        if (!data) continue;

        // Look for the 'home' array in the data structure
        const home = data.home;
        if (!Array.isArray(home) || home.length === 0) continue;

        const homeData = home[0];
        if (homeData && typeof homeData === 'object' && homeData !== null) {
          const collaboardLink = homeData.collaboardLink;
          const department = homeData.department;

          if (
            typeof collaboardLink === 'string' &&
            collaboardLink.startsWith('http')
          ) {
            const deptName = typeof department === 'string' 
              ? department 
              : formatDepartmentName(k);
            validDepartments.push(deptName);
            console.log(`✓ ${k} -> ${deptName} (${collaboardLink.substring(0, 50)}...)`);
          } else {
            console.log(`✗ ${k} -> no valid collaboard link`);
          }
        } else {
          console.log(`✗ ${k} -> no valid home data`);
        }
      } catch (err) {
        console.log(`✗ ${k} -> error reading data:`, err.message);
      }
    }

    // Deduplicate by department name (same as DynamicCollaboards)
    const uniqueDepartments = new Map();
    for (const dept of validDepartments) {
      if (!uniqueDepartments.has(dept)) {
        uniqueDepartments.set(dept, dept);
      }
    }

    console.log('\nUnique departments with valid collaboard data:');
    const sortedDepts = Array.from(uniqueDepartments.keys()).sort();
    sortedDepts.forEach((dept, i) => {
      console.log(`${i + 1}. ${dept}`);
    });
    
    console.log(`\nTotal department count: ${uniqueDepartments.size}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

countDepartments();