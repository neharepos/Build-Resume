import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { resumes } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";

// Add this to your existing PUT and DELETE file
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const resumeId = parseInt(id);

        if (isNaN(resumeId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const resume = await db.select()
            .from(resumes)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

        if (!resume.length) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume[0]);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();

        if (typeof body !== 'object' || body === null || Array.isArray(body)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { id } = await params;
        const resumeId = parseInt(id);

        if (isNaN(resumeId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Prevent updating protected fields
        delete body.id;
        delete body.userId;
        delete body.createdAt;
        body.updatedAt = new Date(); // Update the timestamp automatically

        const updatedResume = await db.update(resumes)
            .set(body)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
            .returning();

        return NextResponse.json(updatedResume[0]);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const resumeId = parseInt(id);

        if (isNaN(resumeId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        await db.delete(resumes)
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

        return NextResponse.json({ message: "Resume deleted successfully" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}