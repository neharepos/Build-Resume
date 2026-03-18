import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/src/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if exists
    const userExists = await db.select().from(users).where(eq(users.email, email));
    if (userExists.length > 0) return NextResponse.json({ error: "User exists" }, { status: 400 });

    // Hash & Create
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.insert(users).values({
      username: name,
      email,
      password: hashedPassword
    }).returning();

    // Send Verification Email
    await sendEmail({ email, emailType: "VERIFY", userId: newUser[0].id });

    return NextResponse.json({ message: "User registered. Please verify email." }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}