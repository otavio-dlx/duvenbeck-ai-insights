import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Departments table
export const departments = pgTable(
  "departments",
  {
    id: text("id").primaryKey(), // e.g., 'accounting', 'hr', etc.
    name: text("name").notNull(),
    description: text("description"),
    collaboardLink: text("collaboard_link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("dept_name_idx").on(table.name),
  })
);

// Workshop sessions table
export const workshopSessions = pgTable(
  "workshop_sessions",
  {
    id: text("id").primaryKey(),
    departmentId: text("department_id")
      .references(() => departments.id)
      .notNull(),
    date: timestamp("date").notNull(),
    collaboardLink: text("collaboard_link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    deptDateIdx: index("workshop_dept_date_idx").on(
      table.departmentId,
      table.date
    ),
  })
);

// Ideas table - core entity for all AI initiative ideas
export const ideas = pgTable(
  "ideas",
  {
    id: text("id").primaryKey(),
    departmentId: text("department_id")
      .references(() => departments.id)
      .notNull(),
    workshopSessionId: text("workshop_session_id").references(
      () => workshopSessions.id
    ),

    // Priority and classification
    finalPrio: text("final_prio").notNull(), // e.g., "1-A", "2-B"

    // Content keys for translations
    ideaKey: text("idea_key").notNull(),
    problemKey: text("problem_key").notNull(),
    solutionKey: text("solution_key").notNull(),

    // Ownership and metadata
    owner: text("owner").notNull(),

    // Scoring metrics (1-5 scale)
    complexity: integer("complexity").notNull(),
    cost: integer("cost").notNull(),
    roi: integer("roi").notNull(),
    risk: integer("risk").notNull(),
    strategicAlignment: integer("strategic_alignment").notNull(),

    // Calculated priority score
    priorityScore: decimal("priority_score", { precision: 10, scale: 2 }),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    deptIdx: index("ideas_dept_idx").on(table.departmentId),
    prioIdx: index("ideas_prio_idx").on(table.finalPrio),
    ideaKeyUnique: uniqueIndex("ideas_idea_key_unique").on(table.ideaKey),
    problemKeyUnique: uniqueIndex("ideas_problem_key_unique").on(
      table.problemKey
    ),
    solutionKeyUnique: uniqueIndex("ideas_solution_key_unique").on(
      table.solutionKey
    ),
  })
);

// AI-generated tags for ideas - this solves the main performance issue
export const ideaTags = pgTable(
  "idea_tags",
  {
    id: text("id").primaryKey(),
    ideaId: text("idea_id")
      .references(() => ideas.id)
      .notNull(),
    tag: text("tag").notNull(),
    category: text("category").notNull(), // e.g., 'technology', 'business', 'impact', etc.
    confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
    generatedAt: timestamp("generated_at").defaultNow().notNull(),
  },
  (table) => ({
    ideaIdx: index("idea_tags_idea_idx").on(table.ideaId),
    tagIdx: index("idea_tags_tag_idx").on(table.tag),
    categoryIdx: index("idea_tags_category_idx").on(table.category),
    ideaTagUnique: uniqueIndex("idea_tags_idea_tag_unique").on(
      table.ideaId,
      table.tag
    ),
  })
);

// Translation keys and values - centralized translation management
export const translations = pgTable(
  "translations",
  {
    id: text("id").primaryKey(),
    translationKey: text("translation_key").notNull(),
    language: text("language").notNull(), // 'en', 'de'
    value: text("value").notNull(),
    category: text("category"), // e.g., 'ideas', 'problems', 'solutions', 'ui'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    keyLangUnique: uniqueIndex("translations_key_lang_unique").on(
      table.translationKey,
      table.language
    ),
    keyIdx: index("translations_key_idx").on(table.translationKey),
    langIdx: index("translations_lang_idx").on(table.language),
    categoryIdx: index("translations_category_idx").on(table.category),
  })
);

// Participants - people involved in workshops
export const participants = pgTable(
  "participants",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    departmentId: text("department_id").references(() => departments.id),
    role: text("role"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex("participants_email_unique").on(table.email),
    deptIdx: index("participants_dept_idx").on(table.departmentId),
  })
);

// Workshop participants - many-to-many relationship
export const workshopParticipants = pgTable(
  "workshop_participants",
  {
    workshopSessionId: text("workshop_session_id")
      .references(() => workshopSessions.id)
      .notNull(),
    participantId: text("participant_id")
      .references(() => participants.id)
      .notNull(),
    role: text("role"), // e.g., 'facilitator', 'participant', 'observer'
  },
  (table) => ({
    workshopParticipantUnique: uniqueIndex("workshop_participants_unique").on(
      table.workshopSessionId,
      table.participantId
    ),
  })
);

// System settings and configuration
export const systemSettings = pgTable("system_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit log for tracking changes
export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    tableName: text("table_name").notNull(),
    recordId: text("record_id").notNull(),
    action: text("action").notNull(), // 'INSERT', 'UPDATE', 'DELETE'
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    userId: text("user_id"), // for future user management
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => ({
    tableIdx: index("audit_log_table_idx").on(table.tableName),
    recordIdx: index("audit_log_record_idx").on(table.recordId),
    timestampIdx: index("audit_log_timestamp_idx").on(table.timestamp),
  })
);

// Define relationships
export const departmentsRelations = relations(departments, ({ many }) => ({
  ideas: many(ideas),
  workshopSessions: many(workshopSessions),
  participants: many(participants),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  department: one(departments, {
    fields: [ideas.departmentId],
    references: [departments.id],
  }),
  workshopSession: one(workshopSessions, {
    fields: [ideas.workshopSessionId],
    references: [workshopSessions.id],
  }),
  tags: many(ideaTags),
}));

export const ideaTagsRelations = relations(ideaTags, ({ one }) => ({
  idea: one(ideas, {
    fields: [ideaTags.ideaId],
    references: [ideas.id],
  }),
}));

export const workshopSessionsRelations = relations(
  workshopSessions,
  ({ one, many }) => ({
    department: one(departments, {
      fields: [workshopSessions.departmentId],
      references: [departments.id],
    }),
    ideas: many(ideas),
    participants: many(workshopParticipants),
  })
);

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    department: one(departments, {
      fields: [participants.departmentId],
      references: [departments.id],
    }),
    workshops: many(workshopParticipants),
  })
);

export const workshopParticipantsRelations = relations(
  workshopParticipants,
  ({ one }) => ({
    workshopSession: one(workshopSessions, {
      fields: [workshopParticipants.workshopSessionId],
      references: [workshopSessions.id],
    }),
    participant: one(participants, {
      fields: [workshopParticipants.participantId],
      references: [participants.id],
    }),
  })
);

// Export types for TypeScript
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;

export type IdeaTag = typeof ideaTags.$inferSelect;
export type NewIdeaTag = typeof ideaTags.$inferInsert;

export type Translation = typeof translations.$inferSelect;
export type NewTranslation = typeof translations.$inferInsert;

export type WorkshopSession = typeof workshopSessions.$inferSelect;
export type NewWorkshopSession = typeof workshopSessions.$inferInsert;

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
