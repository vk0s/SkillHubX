import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateContentFromText(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate content");
  }
}

export const QUIZ_PROMPT_TEMPLATE = `
Generate a JSON object containing a quiz, revision notes, a summary, a high scoring strategy, and a chapter-wise planner based on the topic below.
The JSON structure should be exactly:
{
  "quiz": [
    { "question": "...", "options": ["A", "B", "C", "D"], "answer": "index_of_correct_option" }
  ],
  "notes": "markdown_string",
  "summary": "string",
  "strategy": "string",
  "planner": [
    { "chapter": "...", "plan": "..." }
  ]
}
Topic:
`;
