import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  username: text("username").notNull(),

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

  fullName: text("full_name"),

  designation: text("designation"),

  summary: text("summary"),

  email: text("email"),

  phone: text("phone"),

  location: text("location"),

  linkedin: text("linkedin"),

  github: text("github"),

  website: text("website"),

  theme: text("theme"),

  thumbnailLink: text("thumbnail_link"),

  // Arrays using JSON
  skills: jsonb("skills"),

  projects: jsonb("projects"),

  education: jsonb("education"),

  workExperience: jsonb("work_experience"),

  certifications: jsonb("certifications"),

  languages: jsonb("languages"),

  interests: jsonb("interests"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
})