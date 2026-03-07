import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";

import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: "User found",
      data: user[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}