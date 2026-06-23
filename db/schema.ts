import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leads table - stores all quote requests
export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  insuranceType: varchar("insuranceType", { length: 100 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "quoted", "bound", "lost"])
    .default("new")
    .notNull(),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Messages table - stores general contact form submissions
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================================
// INTAKE FORM TABLES
// ============================================================
// These tables store the comprehensive Acrisure Personal Lines
// Placement Intake Form submissions - both the internal form
// and the personal lines placement form (eff. 06-15-26).
// ============================================================

// Intake submissions - main table for client intake forms
export const intakeSubmissions = mysqlTable("intake_submissions", {
  id: serial("id").primaryKey(),

  // Section 1: Client / Routing Info (key fields for search/filter)
  primaryNamedInsured: varchar("primary_named_insured", { length: 255 }).notNull(),
  dob: varchar("dob", { length: 50 }),
  primaryAddress: text("primary_address"),
  riskAddress: text("risk_address"),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  occupation: varchar("occupation", { length: 255 }),
  riskState: varchar("risk_state", { length: 50 }),

  // Lines of business included
  linesIncluded: varchar("lines_included", { length: 255 }),

  // Submission metadata
  status: mysqlEnum("status", ["new", "in_review", "submitted_to_carrier", "quoted", "bound", "declined"])
    .default("new")
    .notNull(),
  formType: mysqlEnum("form_type", ["internal", "personal_lines"]).default("personal_lines").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),

  // Full form data stored as JSON for flexibility
  formData: json("form_data"),

  // Notes from Paul/team
  internalNotes: text("internal_notes"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type IntakeSubmission = typeof intakeSubmissions.$inferSelect;
export type InsertIntakeSubmission = typeof intakeSubmissions.$inferInsert;
