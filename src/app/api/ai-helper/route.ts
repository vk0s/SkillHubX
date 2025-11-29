import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";

// Ensure API key is set
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { mode, text, fileUrl, uploadId } = await req.json();

    if (!text && !uploadId) return new NextResponse("No input provided", { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    let prompt = "";
    let contextText = text || "";

    // If uploadId provided, fetch extracted text from DB
    if (uploadId) {
        const upload = await db.upload.findUnique({ where: { id: uploadId } });
        if (upload && upload.extractedText) {
            contextText = upload.extractedText;
        }
    }

    switch (mode) {
      case "notes":
        prompt = `Generate structured study notes in Markdown format for the following text. Use headers, bullet points, and bold text for key terms. Text: ${contextText}`;
        break;
      case "mcq":
        prompt = `Generate 30 multiple choice questions (MCQs) based on the text. Return ONLY a JSON array with 'question', 'options' (array of 4 strings), and 'answer' (index of correct option). Text: ${contextText}`;
        break;
      case "studyplan":
        prompt = `Create a customized study plan based on this text. Break it down by days/chapters. Text: ${contextText}`;
        break;
      default:
        return new NextResponse("Invalid mode", { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    let output = response.text();

    // Clean JSON if MCQ
    if (mode === "mcq") {
        output = output.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    // Save Note if mode is notes
    if (mode === "notes") {
        let dbUser = await db.user.findUnique({ where: { clerkId: userId } });
        if (dbUser) {
             await db.note.create({
                data: {
                    userId: dbUser.id,
                    content: output,
                    topic: "Generated Note",
                    generatedFromUploadId: uploadId || null
                }
            });
            // Reward
             await db.user.update({
                where: { id: dbUser.id },
                data: { walletBalance: { increment: 15 } }
            });
             await db.rewardTransaction.create({
                data: {
                    userId: dbUser.id,
                    amount: 15,
                    reason: "Generated Notes",
                    type: "EARN"
                }
            });
        }
    }

    return NextResponse.json({ output });

  } catch (error) {
    console.error("AI Error:", error);
    return new NextResponse("Internal AI Error", { status: 500 });
  }
}
