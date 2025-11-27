'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function generateQuiz(text: string) {
    if (process.env.GEMINI_API_KEY === "mock-key" || !process.env.GEMINI_API_KEY) {
        return mockQuiz();
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate a quiz with 5 multiple choice questions based on the following text.
        Format the output as a JSON array of objects, where each object has:
        - question (string)
        - options (array of strings)
        - answer (index of correct option, number)

        Do not include markdown formatting like \`\`\`json. Just raw JSON.

        Text: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present just in case
        const jsonStr = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Error:", error);
        return mockQuiz();
    }
}

export async function generateNotes(topic: string) {
    if (process.env.GEMINI_API_KEY === "mock-key" || !process.env.GEMINI_API_KEY) {
        return `## Notes for ${topic} (Mock)\n\n1. Key Point One\n2. Key Point Two\n3. Conclusion`;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate comprehensive revision notes for the topic: "${topic}". Use Markdown format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
         console.error("AI Error:", error);
         return `Failed to generate notes for ${topic}.`;
    }
}

function mockQuiz() {
    return [
        {
            question: "What is the powerhouse of the cell? (Mock)",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
            answer: 1
        },
        {
            question: "What is the speed of light? (Mock)",
            options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "Instant"],
            answer: 0
        },
        {
            question: "Which language is used for web apps? (Mock)",
            options: ["Python", "C++", "JavaScript", "Java"],
            answer: 2
        }
    ]
}
