import i18n from "../src/i18n/config.js";

console.log("🧪 Testing i18n Translation...\n");

// Wait for i18n to be ready
setTimeout(() => {
  const testKeys = [
    "hr.ideas.hr_data_dashboard",
    "compliance.ideas.damage_claim_review",
    "controlling.problems.presentation_creation",
    "corp_dev.solutions.market_analysis_automation",
  ];

  console.log("Current language:", i18n.language);
  console.log("\nTesting translations:\n");

  testKeys.forEach((key) => {
    const translated = i18n.t(key);
    const status = translated === key ? "❌ MISSING" : "✅";
    console.log(`${status} ${key}`);
    console.log(`   → ${translated}\n`);
  });

  // Check if translations are working
  const allWorking = testKeys.every((key) => i18n.t(key) !== key);

  if (allWorking) {
    console.log("✅ All translations working correctly!");
    console.log(
      "🎉 The RAG service should now provide proper context to the LLM.\n"
    );
  } else {
    console.log("❌ Some translations are missing!");
    console.log("💡 Check src/i18n/locales/en.json for missing keys.\n");
  }
}, 100);
