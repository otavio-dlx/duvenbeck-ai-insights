CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text NOT NULL,
	"action" text NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"user_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"collaboard_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idea_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"idea_id" text NOT NULL,
	"tag" text NOT NULL,
	"category" text NOT NULL,
	"confidence" numeric(3, 2),
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"department_id" text NOT NULL,
	"workshop_session_id" text,
	"final_prio" text NOT NULL,
	"idea_key" text NOT NULL,
	"problem_key" text NOT NULL,
	"solution_key" text NOT NULL,
	"owner" text NOT NULL,
	"complexity" integer NOT NULL,
	"cost" integer NOT NULL,
	"roi" integer NOT NULL,
	"risk" integer NOT NULL,
	"strategic_alignment" integer NOT NULL,
	"priority_score" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"department_id" text,
	"role" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" text PRIMARY KEY NOT NULL,
	"translation_key" text NOT NULL,
	"language" text NOT NULL,
	"value" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workshop_participants" (
	"workshop_session_id" text NOT NULL,
	"participant_id" text NOT NULL,
	"role" text
);
--> statement-breakpoint
CREATE TABLE "workshop_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"department_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"collaboard_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea_tags" ADD CONSTRAINT "idea_tags_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_workshop_session_id_workshop_sessions_id_fk" FOREIGN KEY ("workshop_session_id") REFERENCES "public"."workshop_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workshop_participants" ADD CONSTRAINT "workshop_participants_workshop_session_id_workshop_sessions_id_fk" FOREIGN KEY ("workshop_session_id") REFERENCES "public"."workshop_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workshop_participants" ADD CONSTRAINT "workshop_participants_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workshop_sessions" ADD CONSTRAINT "workshop_sessions_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_table_idx" ON "audit_log" USING btree ("table_name");--> statement-breakpoint
CREATE INDEX "audit_log_record_idx" ON "audit_log" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "audit_log_timestamp_idx" ON "audit_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "dept_name_idx" ON "departments" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idea_tags_idea_idx" ON "idea_tags" USING btree ("idea_id");--> statement-breakpoint
CREATE INDEX "idea_tags_tag_idx" ON "idea_tags" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "idea_tags_category_idx" ON "idea_tags" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "idea_tags_idea_tag_unique" ON "idea_tags" USING btree ("idea_id","tag");--> statement-breakpoint
CREATE INDEX "ideas_dept_idx" ON "ideas" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "ideas_prio_idx" ON "ideas" USING btree ("final_prio");--> statement-breakpoint
CREATE UNIQUE INDEX "ideas_idea_key_unique" ON "ideas" USING btree ("idea_key");--> statement-breakpoint
CREATE UNIQUE INDEX "ideas_problem_key_unique" ON "ideas" USING btree ("problem_key");--> statement-breakpoint
CREATE UNIQUE INDEX "ideas_solution_key_unique" ON "ideas" USING btree ("solution_key");--> statement-breakpoint
CREATE UNIQUE INDEX "participants_email_unique" ON "participants" USING btree ("email");--> statement-breakpoint
CREATE INDEX "participants_dept_idx" ON "participants" USING btree ("department_id");--> statement-breakpoint
CREATE UNIQUE INDEX "translations_key_lang_unique" ON "translations" USING btree ("translation_key","language");--> statement-breakpoint
CREATE INDEX "translations_key_idx" ON "translations" USING btree ("translation_key");--> statement-breakpoint
CREATE INDEX "translations_lang_idx" ON "translations" USING btree ("language");--> statement-breakpoint
CREATE INDEX "translations_category_idx" ON "translations" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "workshop_participants_unique" ON "workshop_participants" USING btree ("workshop_session_id","participant_id");--> statement-breakpoint
CREATE INDEX "workshop_dept_date_idx" ON "workshop_sessions" USING btree ("department_id","date");