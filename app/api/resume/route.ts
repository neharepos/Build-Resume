import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { resumes } from "@/src/db/schema";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { eq } from "drizzle-orm";

// GET all resumes for the logged-in user
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const userResumes = await db.select().from(resumes).where(eq(resumes.userId, userId));
        return NextResponse.json(userResumes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// CREATE a new resume
export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const body = await request.json();
        
        const newResume = await db.insert(resumes).values({
            ...body,
            userId: userId,
        }).returning();

        return NextResponse.json(newResume[0], { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}