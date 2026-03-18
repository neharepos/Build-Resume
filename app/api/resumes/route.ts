import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { resumes } from "@/src/db/schema";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { eq, desc } from "drizzle-orm";

// GET all resumes for the logged-in user
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const userResumes = await db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.updatedAt));
        return NextResponse.json(userResumes);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// CREATE a new resume
export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const {title} = await request.json();
        
        const defaultResumeData = {
            profileInfo: { fullName: '', designation: '', summary: '', profileImg: null },
            contactInfo: { email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
            workExperience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: [],
            interests: [],
        };

        const newResume = await db.insert(resumes).values({
            userId,
            title: title || "Untitled Resume",
            ...defaultResumeData,
        }).returning();

        return NextResponse.json(newResume[0], { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}