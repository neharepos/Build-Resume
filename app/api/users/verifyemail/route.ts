import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq, gt, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log(token);

    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.verifyToken, token),
          gt(users.verifyTokenExpiry, new Date())
        )
      );

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      })
      .where(eq(users.id, user[0].id));

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}