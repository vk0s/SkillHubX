import AiCard from "@/components/AiCard";
import { Brain, FileText, CalendarCheck, Sparkles } from "lucide-react";

export default function AiHelperPage() {
    return (
        <div className="py-10">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold mb-6 neon-text flex items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10 text-cyan-400" />
                    AI Learning Hub
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Supercharge your learning with Gemini AI. Generate quizzes from any text, create high-scoring revision notes, and plan your success.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <AiCard
                    title="Quiz Generator"
                    description="Upload text, notes, or PDFs and let AI instantly generate multiple-choice questions with explanations to test your knowledge."
                    href="/ai-helper/quiz"
                    icon={<Brain className="w-12 h-12" />}
                />
                <AiCard
                    title="Smart Notes"
                    description="Enter a topic or paste rough notes. AI will structure them into high-quality revision notes optimized for exam scoring."
                    href="/ai-helper/notes"
                    icon={<FileText className="w-12 h-12" />}
                />
                <AiCard
                    title="Study Planner"
                    description="Coming Soon: Get a personalized day-wise study plan for any subject or goal, tailored to your timeline."
                    href="#"
                    icon={<CalendarCheck className="w-12 h-12 opacity-50" />}
                />
            </div>
        </div>
    );
}
