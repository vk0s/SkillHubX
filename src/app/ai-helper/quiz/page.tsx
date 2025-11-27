'use client';

import { useState } from "react";
import { generateQuiz } from "@/lib/ai-helper";
import { ArrowRight, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";

// Types
type QuizQuestion = {
    question: string;
    options: string[];
    answer: number;
    explanation?: string;
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
        // Using server action directly
        const result = await generateQuiz(text);
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
        <div className="py-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 neon-text">AI Quiz Generator</h1>
            <p className="text-gray-400 mb-8">Paste your notes or topic details below to generate a practice quiz.</p>

            {!quiz ? (
                <div className="glassmorphism p-8 rounded-2xl border border-white/10 space-y-6">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-cyan-500" />
                            Source Text / Notes
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-64 bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none transition-all resize-none"
                            placeholder="Paste your study material here (e.g., 'Photosynthesis process...', 'History of Rome...')"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-right">Supports up to 5000 characters</p>
                    </div>

                    {/* Placeholder for OCR/PDF Upload */}
                    <div className="p-4 border border-dashed border-gray-700 rounded-xl bg-black/20 text-center opacity-60">
                        <p className="text-sm text-gray-400">PDF/Image Upload (OCR) coming soon via Tesseract.js / Cloud Vision API</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !text}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating Quiz...</> : "Generate 10 Questions"}
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-bold text-white">Generated Quiz</h2>
                         <button onClick={() => { setQuiz(null); setText(""); }} className="text-sm text-cyan-400 hover:underline">Start Over</button>
                    </div>

                    {quiz.map((q, i) => (
                        <div key={i} className="glassmorphism p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex gap-3">
                                <span className="bg-cyan-900/30 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-cyan-500/30 flex-shrink-0">{i + 1}</span>
                                {q.question}
                            </h3>
                            <div className="space-y-3 pl-11">
                                {q.options.map((opt, optIndex) => {
                                    const isSelected = answers[i] === optIndex;
                                    const isCorrect = q.answer === optIndex;

                                    let className = "w-full p-4 rounded-xl text-left border transition-all flex justify-between items-center group ";

                                    if (showResults) {
                                        if (isCorrect) className += "bg-green-950/40 border-green-500 text-green-300";
                                        else if (isSelected) className += "bg-red-950/40 border-red-500 text-red-300 opacity-60";
                                        else className += "border-gray-800 text-gray-500 opacity-50";
                                    } else {
                                        if (isSelected) className += "bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]";
                                        else className += "border-gray-800 bg-black/20 hover:bg-white/5 text-gray-300 hover:border-gray-600";
                                    }

                                    return (
                                        <button
                                            key={optIndex}
                                            onClick={() => handleOptionSelect(i, optIndex)}
                                            disabled={showResults}
                                            className={className}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-gray-600 text-gray-500'}`}>
                                                    {String.fromCharCode(65 + optIndex)}
                                                </span>
                                                {opt}
                                            </span>
                                            {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                                            {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {showResults && q.explanation && (
                                <div className="mt-4 ml-11 p-4 bg-blue-950/20 border border-blue-900/50 rounded-lg text-sm text-blue-300">
                                    <strong>Explanation:</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}

                    {!showResults ? (
                        <button
                            onClick={() => setShowResults(true)}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-5 rounded-xl text-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.01]"
                        >
                            Submit & Check Score
                        </button>
                    ) : (
                        <div className="text-center p-12 glassmorphism rounded-2xl border border-white/10">
                            <h2 className="text-4xl font-bold mb-4 neon-text">Your Score: {calculateScore()} / {quiz.length}</h2>
                            <p className="text-gray-400 mb-8">
                                {calculateScore() > 7 ? "Excellent work! You've mastered this topic." : "Keep practicing! Review the explanations above."}
                            </p>
                            <button
                                onClick={() => { setQuiz(null); setText(""); }}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full font-bold transition-all"
                            >
                                Generate New Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
