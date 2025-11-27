import AiCard from "@/components/AiCard";
import { Brain, FileText, CalendarCheck } from "lucide-react";

export default function AiHelperPage() {
    return (
        <div className="py-10">
            <h1 className="text-4xl font-bold mb-4 neon-text text-center">AI Learning Helper</h1>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Supercharge your learning with our AI tools. Generate quizzes, create revision notes, or plan your study schedule instantly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AiCard
                    title="Quiz Generator"
                    description="Upload text or PDFs and let AI generate multiple-choice questions to test your knowledge."
                    href="/ai-helper/quiz"
                    icon={<Brain className="w-10 h-10" />}
                />
                <AiCard
                    title="Smart Notes"
                    description="Enter a topic and get comprehensive, structured revision notes generated instantly."
                    href="/ai-helper/notes"
                    icon={<FileText className="w-10 h-10" />}
                />
                <AiCard
                    title="Study Planner"
                    description="Get a personalized day-wise study plan for any subject or goal."
                    href="#" // Placeholder for now
                    icon={<CalendarCheck className="w-10 h-10" />}
                />
            </div>
        </div>
    );
}
