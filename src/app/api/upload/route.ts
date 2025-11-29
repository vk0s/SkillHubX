import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
// @ts-ignore
import pdf from "pdf-parse";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return new NextResponse("No file uploaded", { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else {
        extractedText = "Image content placeholder (OCR required)";
    }

    // Ensure user exists in DB
    let dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                clerkId: userId,
                email: "user@example.com", // Placeholder
            }
        });
    }

    const upload = await db.upload.create({
      data: {
        userId: dbUser.id,
        fileUrl: `/uploads/${file.name}`, // Mock Cloudinary URL
        fileType: file.type,
        extractedText: extractedText.substring(0, 5000),
      },
    });

    // Reward
    await db.user.update({
        where: { id: dbUser.id },
        data: { walletBalance: { increment: 10 } }
    });

    await db.rewardTransaction.create({
        data: {
            userId: dbUser.id,
            amount: 10,
            reason: "File Upload",
            type: "EARN"
        }
    });

    return NextResponse.json({ success: true, uploadId: upload.id, text: extractedText });

  } catch (error) {
    console.error("Upload Error:", error);
    return new NextResponse("Internal Upload Error", { status: 500 });
  }
}
