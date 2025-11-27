'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// TODO: Replace mock key with real key from process.env.GEMINI_API_KEY
// Ensure your .env has GEMINI_API_KEY=...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function generateQuiz(text: string) {
    if (process.env.GEMINI_API_KEY === "mock-key" || !process.env.GEMINI_API_KEY) {
        return mockQuiz();
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate a quiz with 10 multiple choice questions based on the following text.
        Format the output as a raw JSON array of objects (no markdown blocks), where each object has:
        - question (string)
        - options (array of strings)
        - answer (index of correct option, number)
        - explanation (string)

        Text: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Error:", error);
        return mockQuiz();
    }
}

export async function generateNotes(topic: string, examMode: boolean) {
    if (process.env.GEMINI_API_KEY === "mock-key" || !process.env.GEMINI_API_KEY) {
        return mockNotes(topic, examMode);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate comprehensive ${examMode ? 'exam-focused high-scoring' : 'revision'} notes for the topic: "${topic}".
        Include key definitions, formulas (if any), and bullet points. Use Markdown format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
         console.error("AI Error:", error);
         return mockNotes(topic, examMode);
    }
}

function mockQuiz() {
    return Array(10).fill(null).map((_, i) => ({
        question: `Mock Question ${i + 1}: What is the capital of AI?`,
        options: ["Python", "Data", "Silicon", "Algorithm"],
        answer: 1,
        explanation: "Data is often considered the fuel for AI."
    }));
}

function mockNotes(topic: string, examMode: boolean) {
    return `## ${examMode ? 'High Scoring ' : ''}Notes for ${topic} (Mock)

**Key Concepts:**
*   Concept 1: Definition and importance.
*   Concept 2: Application in real world.

**Exam Tips:**
1.  Focus on keywords.
2.  Draw diagrams where possible.

*Note: This is a mock response because GEMINI_API_KEY is missing.*`;
}
