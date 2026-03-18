import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { resumes } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";

// Add this to your existing PUT and DELETE file
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getDataFromToken(request);
        const resumeId = parseInt(params.id);

        const resume = await db.select()
            .from(resumes)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

        if (!resume.length) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getDataFromToken(request);
        const body = await request.json();
        const resumeId = parseInt(params.id);

        const updatedResume = await db.update(resumes)
            .set(body)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
            .returning();

        return NextResponse.json(updatedResume[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getDataFromToken(request);
        const resumeId = parseInt(params.id);

        await db.delete(resumes)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

        return NextResponse.json({ message: "Resume deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}