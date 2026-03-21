import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { db } from "@/src/db";
import { resumes } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Security: Identify User and Resume ID
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const resumeId = parseInt(id);

        const formData = await request.formData();
        const file = formData.get("profileImage") as File; // 'profileImage' matches your frontend input name

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        // 2. Validation (Filter)
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // 3. Save to Local Storage (public/uploads)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);

        const imageUrl = `/uploads/${filename}`;

        // 4. Update the Resume in the Database
        await db.update(resumes)
            .set({ 
                // Assuming your Drizzle schema has a column for this
                thumbnailLink: imageUrl 
            })
            .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

        return NextResponse.json({ 
            message: "Upload successful",
            imageUrl 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}