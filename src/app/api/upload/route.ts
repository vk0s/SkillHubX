import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
// @ts-ignore
import pdf from "pdf-parse";

// Increase body limit for Next.js if needed in config
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return new NextResponse("No file uploaded", { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (file.type.startsWith("image/")) {
        extractedText = "[Image content - OCR required]";
    } else {
        return new NextResponse("Unsupported file type", { status: 400 });
    }

    const fileUrl = `/uploads/${file.name}`; // Simplified

    const upload = await db.upload.create({
      data: {
        userId: session.user.id,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        extractedText: extractedText.substring(0, 5000), // Limit text storage
      },
    });

    // Add Reward
    await db.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 10 } }
    });

    await db.rewards.create({
        data: {
            userId: session.user.id,
            points: 10,
            reason: "File Upload"
        }
    });

    return NextResponse.json({ success: true, uploadId: upload.id, text: extractedText });

  } catch (error) {
    console.error("Upload Error:", error);
    return new NextResponse("Internal Upload Error", { status: 500 });
  }
}
