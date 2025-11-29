"use client";

import { useState } from "react";
import { Loader2, Trophy, Clock, AlertCircle } from "lucide-react";

export default function MockTestPage() {
    const [step, setStep] = useState(1); // 1: Setup, 2: Test, 3: Result
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [testId, setTestId] = useState("");
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 mins

    const startTest = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/mock/create", {
                method: "POST",
                body: JSON.stringify({ subject, difficulty })
            });
            const data = await res.json();
            setQuestions(data.questions);
            setTestId(data.testId);
            setStep(2);
        } catch (e) {
            alert("Failed to start test");
        } finally {
            setLoading(false);
        }
    };

    const submitTest = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/mock/submit", {
                method: "POST",
                body: JSON.stringify({ testId, userAnswers: answers, timeTaken: 1800 - timeLeft })
            });
            const data = await res.json();
            setResult(data);
            setStep(3);
        } catch(e) {
            alert("Submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 glassmorphism">
                    <h1 className="text-3xl font-bold mb-6 text-center">AI Mock Test</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Subject</label>
                            <input
                                value={subject} onChange={e => setSubject(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 focus:border-cyan-500 outline-none"
                                placeholder="e.g. History, Python, Physics"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                            <select
                                value={difficulty} onChange={e => setDifficulty(e.target.value)}
                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 outline-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <button
                            onClick={startTest} disabled={!subject || loading}
                            className="w-full h-12 bg-cyan-600 rounded-lg font-bold mt-4 hover:bg-cyan-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Start Test"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8 sticky top-0 bg-black/80 backdrop-blur py-4 z-10 border-b border-white/10">
                        <h2 className="text-xl font-bold">{subject} Test</h2>
                        <div className="flex items-center gap-2 text-orange-400 font-mono text-xl">
                            <Clock /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <button onClick={submitTest} className="px-6 py-2 bg-green-600 rounded-lg font-bold hover:bg-green-500">Submit</button>
                    </div>

                    <div className="space-y-8">
                        {questions.map((q, i) => (
                            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold mb-4"><span className="text-gray-500 mr-2">{i+1}.</span>{q.question}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <button
                                            key={optIdx}
                                            onClick={() => setAnswers({...answers, [i]: optIdx})}
                                            className={`p-4 rounded-lg text-left transition-colors border ${answers[i] === optIdx ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-black/20 border-white/10 hover:bg-white/5'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3 && result) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                 <div className="text-center space-y-8 max-w-xl w-full">
                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                    <h1 className="text-5xl font-bold">Score: {result.score} / {result.total}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                            <h3 className="text-red-400 font-bold mb-1">Incorrect</h3>
                            <p className="text-3xl">{result.wrong}</p>
                        </div>
                        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                            <h3 className="text-green-400 font-bold mb-1">Correct</h3>
                            <p className="text-3xl">{result.score}</p>
                        </div>
                    </div>
                    <button onClick={() => setStep(1)} className="px-8 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-colors">Take Another Test</button>
                 </div>
            </div>
        );
    }

    return null;
}
