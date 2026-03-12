CREATE TABLE "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"full_name" text,
	"designation" text,
	"summary" text,
	"email" text,
	"phone" text,
	"location" text,
	"linkedin" text,
	"github" text,
	"website" text,
	"theme" text,
	"thumbnail_link" text,
	"skills" jsonb,
	"projects" jsonb,
	"education" jsonb,
	"work_experience" jsonb,
	"certifications" jsonb,
	"languages" jsonb,
	"interests" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verify_token" text,
	"verify_token_expiry" timestamp,
	"forgot_password_token" text,
	"forgot_password_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;