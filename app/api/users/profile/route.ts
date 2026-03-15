import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        // This replaces the 'protect' middleware
        const userId = await getDataFromToken(request);

        const user = await db.select()
            .from(users)
            .where(eq(users.id, userId));

        if (!user.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Don't send the password back!
        const { password, ...userData } = user[0];

        return NextResponse.json({
            message: "User found",
            data: userData
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}