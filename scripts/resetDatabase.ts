#!/usr/bin/env tsx
import {
  auditLog,
  db,
  departments,
  ideas,
  ideaTags,
  participants,
  systemSettings,
  translations,
  workshopParticipants,
  workshopSessions,
} from "../src/lib/database/index";

async function resetDatabase() {
  console.log("🔥 Starting database reset...");

  try {
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log("🗑️ Deleting audit log...");
    await db.delete(auditLog);

    console.log("🗑️ Deleting system settings...");
    await db.delete(systemSettings);

    console.log("🗑️ Deleting workshop participants...");
    await db.delete(workshopParticipants);

    console.log("🗑️ Deleting participants...");
    await db.delete(participants);

    console.log("🗑️ Deleting idea tags...");
    await db.delete(ideaTags);

    console.log("🗑️ Deleting ideas...");
    await db.delete(ideas);

    console.log("🗑️ Deleting translations...");
    await db.delete(translations);

    console.log("🗑️ Deleting workshop sessions...");
    await db.delete(workshopSessions);

    console.log("🗑️ Deleting departments...");
    await db.delete(departments);

    console.log("✅ Database reset completed successfully!");
    console.log(
      "💡 Run 'npm run db:seed' to populate the database with fresh data"
    );
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

// Run the reset
await resetDatabase();
