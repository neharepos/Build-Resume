import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").default(false),
  verifyToken: text("verify_token"),
  verifyTokenExpiry: timestamp("verify_token_expiry"),
  forgotPasswordToken: text("forgot_password_token"),
  forgotPasswordTokenExpiry: timestamp("forgot_password_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),

  thumbnailLink: text("thumbnail_link"),

  theme: text("theme"),

  fullName: text("full_name"),

  designation: text("designation"),

  summary: text("summary"),

  email: text("email"),

  phone: text("phone"),

  location: text("location"),

  linkedin: text("linkedin"),

  github: text("github"),

  website: text("website"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  company: text("company"),

  role: text("role"),

  startDate: timestamp("start_date"),

  endDate: timestamp("end_date"),

  description: text("description"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const education = pgTable("education", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  degree: text("degree"),

  institution: text("institution"),

  startDate: timestamp("start_date"),

  endDate: timestamp("end_date"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  name: text("name"),

  progress: integer("progress"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  title: text("title"),

  description: text("description"),

  github: text("github"),

  liveDemo: text("live_demo"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  title: text("title"),

  issuer: text("issuer"),

  year: text("year"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  name: text("name"),

  progress: integer("progress"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),

  interest: text("interest"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})