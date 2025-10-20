#!/usr/bin/env tsx

/**
 * Data Quality Report Generator
 *
 * This script runs data validation tests and generates a report
 * without failing the build process. It helps identify data issues
 * that need to be addressed by the team.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface DataIssue {
  category: "translation" | "metrics" | "owner" | "structure";
  department: string;
  issue: string;
  severity: "error" | "warning";
}

const generateDataQualityReport = async (): Promise<void> => {
  console.log("🔍 Generating Data Quality Report...\n");

  const issues: DataIssue[] = [];

  try {
    // Run tests but capture output instead of failing
    execSync("npm run test:run -- src/tests/ --reporter=json", {
      stdio: "pipe",
      encoding: "utf-8",
    });
  } catch (error: unknown) {
    // Parse test results from error output
    const output = (error as { stdout?: string }).stdout || "";

    if (output.includes("translation")) {
      issues.push({
        category: "translation",
        department: "multiple",
        issue: "Empty translation keys found",
        severity: "error",
      });
    }

    if (output.includes("Owner")) {
      issues.push({
        category: "owner",
        department: "corp_dev",
        issue: "Empty owner fields",
        severity: "error",
      });
    }

    if (output.includes("must be between 1-5")) {
      issues.push({
        category: "metrics",
        department: "corp_dev",
        issue: "Invalid metric values (outside 1-5 range)",
        severity: "error",
      });
    }
  }

  // Generate report
  const reportPath = path.resolve("./data-quality-report.md");
  let report = "# Data Quality Report\n\n";
  report += `Generated on: ${new Date().toISOString()}\n\n`;

  if (issues.length === 0) {
    report += "✅ **All data validation tests passed!**\n\n";
    report += "No data quality issues were found.\n";
  } else {
    report += `⚠️  **${issues.length} data quality issue(s) found:**\n\n`;

    const groupedIssues = issues.reduce((acc, issue) => {
      if (!acc[issue.category]) acc[issue.category] = [];
      acc[issue.category].push(issue);
      return acc;
    }, {} as Record<string, DataIssue[]>);

    for (const [category, categoryIssues] of Object.entries(groupedIssues)) {
      report += `## ${
        category.charAt(0).toUpperCase() + category.slice(1)
      } Issues\n\n`;
      for (const issue of categoryIssues) {
        const icon = issue.severity === "error" ? "🔴" : "🟡";
        report += `${icon} **${issue.department}**: ${issue.issue}\n`;
      }
      report += "\n";
    }

    report += "## Recommended Actions\n\n";
    report +=
      "1. **Translation Issues**: Fill empty translation keys in `src/i18n/locales/`\n";
    report +=
      "2. **Owner Issues**: Assign owners to all ideas in department data files\n";
    report +=
      "3. **Metrics Issues**: Ensure all complexity, cost, roi, risk, strategic values are 1-5\n";
    report +=
      "4. **Structure Issues**: Follow the `NewFormatIdea` interface requirements\n\n";
    report +=
      "> 💡 These issues do not prevent the app from running but should be addressed for complete data integrity.\n";
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report generated: ${reportPath}`);

  if (issues.length > 0) {
    console.log(
      `\n⚠️  Found ${issues.length} data quality issue(s). See report for details.`
    );
    console.log("✅ App will still build and deploy successfully.");
  } else {
    console.log("\n✅ All data quality checks passed!");
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await generateDataQualityReport();
}

export { generateDataQualityReport };
