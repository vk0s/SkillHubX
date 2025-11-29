import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { mode, text, subject } = await req.json();

    if (!text) return new NextResponse("No text provided", { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    let prompt = "";

    switch (mode) {
      case "notes":
        prompt = `Generate structured study notes in Markdown format for the following text. Use headers, bullet points, and bold text for key terms. Subject: ${subject}. Text: ${text}`;
        break;
      case "summary":
        prompt = `Summarize the following text into a concise paragraph and 5 key takeaways. Text: ${text}`;
        break;
      case "mcq":
        prompt = `Generate 5 multiple choice questions (MCQs) based on the text. Return a JSON array with 'question', 'options' (array of 4 strings), and 'answer' (index of correct option). Text: ${text}`;
        break;
      case "analyze":
        prompt = `Analyze the text for difficulty level, key concepts, and suggested prerequisites. Text: ${text}`;
        break;
      case "studyplan":
        prompt = `Create a 3-day study plan based on this text. Text: ${text}`;
        break;
      default:
        return new NextResponse("Invalid mode", { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const output = response.text();

    // If notes, save to DB
    if (mode === "notes") {
        await db.notes.create({
            data: {
                userId: session.user.id,
                subject: subject || "General",
                generatedContent: output
            }
        });

        // Reward for notes
        // Ideally call internal logic, but here we can just do DB update directly or trigger reward api
        // Keeping it simple: separate reward call from frontend or event based.
    }

    return NextResponse.json({ output });

  } catch (error) {
    console.error("AI Error:", error);
    return new NextResponse("Internal AI Error", { status: 500 });
  }
}
