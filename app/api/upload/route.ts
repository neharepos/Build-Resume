import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. File Filter Logic
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // 2. Convert to Buffer (to save or send to Cloudinary)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Logic to save buffer to a cloud service goes here...
        
        return NextResponse.json({ message: "File uploaded successfully" });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}