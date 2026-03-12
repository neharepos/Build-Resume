import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

    // 2️⃣ Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3️⃣ Save token in database
    await db
      .update(users)
      .set({
        forgotPasswordToken: resetToken,
        forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
      })
      .where(eq(users.id, user[0].id));

    // 4️⃣ Send reset email
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user[0].id,
      token: resetToken,
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