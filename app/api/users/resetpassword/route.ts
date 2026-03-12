import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/src/db//index";
import { users } from "@/src/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    // 1️⃣ Find user with matching token AND valid expiry
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.forgotPasswordToken, token),
          gt(users.forgotPasswordTokenExpiry, new Date())
        )
      );

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const userData = user[0];

    // 2️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Update password and clear reset token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      })
      .where(eq(users.id, userData.id));

    return NextResponse.json({
      message: "Password updated successfully",
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}