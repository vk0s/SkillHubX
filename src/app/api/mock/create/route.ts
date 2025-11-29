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
    const { subject, difficulty, textContext } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Generate 30 multiple choice questions (MCQs) for the subject "${subject}" at ${difficulty} level.
    Context: ${textContext ? textContext.substring(0, 1000) : "General knowledge of the subject"}.
    Return ONLY valid JSON array where each object has:
    "question" (string),
    "options" (array of 4 strings),
    "answer" (number 0-3 indicating correct option index).
    Do not use markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(jsonString);

    const mockTest = await db.mockTest.create({
        data: {
            subject,
            difficulty,
            questionsJson: questions
        }
    });

    return NextResponse.json({ testId: mockTest.id, questions });

  } catch (error) {
    console.error("Mock Create Error:", error);
    return new NextResponse("Internal Mock Error", { status: 500 });
  }
}
