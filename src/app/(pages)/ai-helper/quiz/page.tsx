'use client';

import { useState } from "react";
import { generateQuiz } from "@/lib/ai-helper";
// We need to call server action properly.
// generateQuiz is exported from lib/ai-helper.ts.
// If it's not marked 'use server', we can't call it directly from client.
// Let's create a server action wrapper in actions.ts or make ai-helper.ts 'use server'
// I'll assume we can make ai-helper.ts 'use server' by adding the directive at the top of that file.
// I will update lib/ai-helper.ts in next step or use a separate action.
// For now, let's update ai-helper.ts to be a server action file.

// ACTUALLY, I missed adding 'use server' to lib/ai-helper.ts. I should fix that.

import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

// Placeholder for the type until we import it or define it
type QuizQuestion = {
    question: string;
    options: string[];
    answer: number;
};

export default function QuizPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async () => {
        if (!text) return;
        setLoading(true);
        // Dynamic import to call server action
        const mod = await import("@/lib/ai-helper");
        const result = await mod.generateQuiz(text);
        setQuiz(result);
        setLoading(false);
        setAnswers({});
        setShowResults(false);
    };

    const handleOptionSelect = (qIndex: number, oIndex: number) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let score = 0;
        quiz.forEach((q, i) => {
            if (answers[i] === q.answer) score++;
        });
        return score;
    };

    return (
        <div className="py-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 neon-text">AI Quiz Generator</h1>

            {!quiz ? (
                <div className="glassmorphism p-8 rounded-xl space-y-4">
                    <label className="block text-gray-300 font-medium">Paste Text / Notes Content</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-64 bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="Paste your study material here..."
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !text}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? "Generating Quiz..." : "Generate Quiz"}
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {quiz.map((q, i) => (
                        <div key={i} className="glassmorphism p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-bold mb-4">{i + 1}. {q.question}</h3>
                            <div className="space-y-3">
                                {q.options.map((opt, optIndex) => {
                                    const isSelected = answers[i] === optIndex;
                                    const isCorrect = q.answer === optIndex;

                                    let className = "w-full p-3 rounded-lg text-left border transition-colors flex justify-between items-center ";

                                    if (showResults) {
                                        if (isCorrect) className += "bg-green-900/30 border-green-500 text-green-300";
                                        else if (isSelected) className += "bg-red-900/30 border-red-500 text-red-300";
                                        else className += "border-gray-700 text-gray-400";
                                    } else {
                                        if (isSelected) className += "bg-cyan-900/30 border-cyan-500 text-cyan-300";
                                        else className += "border-gray-700 hover:bg-gray-800 text-gray-300";
                                    }

                                    return (
                                        <button
                                            key={optIndex}
                                            onClick={() => handleOptionSelect(i, optIndex)}
                                            className={className}
                                        >
                                            {opt}
                                            {showResults && isCorrect && <CheckCircle className="w-5 h-5" />}
                                            {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {!showResults ? (
                        <button
                            onClick={() => setShowResults(true)}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg text-xl"
                        >
                            Submit & Check Score
                        </button>
                    ) : (
                        <div className="text-center p-8 glassmorphism rounded-xl">
                            <h2 className="text-3xl font-bold mb-2">Score: {calculateScore()} / {quiz.length}</h2>
                            <button
                                onClick={() => { setQuiz(null); setText(""); }}
                                className="text-cyan-400 hover:underline mt-4"
                            >
                                Create Another Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
