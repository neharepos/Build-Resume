import { NextRequest, NextResponse } from "next/server";

import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

import { sendEmail } from "@/src/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // 1️⃣ Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // 2️⃣ Send reset email
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user[0].id,
    });

    return NextResponse.json({
      message: "Reset email sent successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}