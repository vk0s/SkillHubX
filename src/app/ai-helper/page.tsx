"use client";

import { Sidebar } from "@/components/Sidebar";
import { generateStudyMaterial } from "@/lib/actions";
import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function AIHelperPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await generateStudyMaterial(topic);
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate content. Ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <BrainCircuit className="text-primary" /> AI Learning Helper
                    </h1>
                    <p className="text-muted-foreground mb-8">Generate quizzes, revision notes, and study plans instantly.</p>

                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6 mb-8">
                        <form onSubmit={handleGenerate} className="flex gap-4">
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a topic (e.g., Quantum Physics, Ancient Rome)"
                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                            </button>
                        </form>
                    </div>

                    {result && (
                        <div className="space-y-8 animate-accordion-down">
                            {/* Summary */}
                            <div className="glassmorphism p-6 rounded-xl border border-primary/20">
                                <h3 className="text-xl font-bold mb-4 text-primary">Summary</h3>
                                <p className="leading-relaxed">{result.summary}</p>
                            </div>

                            {/* Revision Notes */}
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 text-primary">Revision Notes</h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{result.notes}</pre>
                                </div>
                            </div>

                            {/* Quiz */}
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 text-primary">Practice Quiz</h3>
                                <div className="space-y-6">
                                    {result.quiz.map((q: any, i: number) => (
                                        <div key={i} className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
                                            <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {q.options.map((opt: string, j: number) => (
                                                    <div key={j} className={`p-2 rounded border text-sm ${j === q.answer ? 'border-green-500 bg-green-500/10' : 'border-border'}`}>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Planner */}
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 text-primary">Chapter-wise Planner</h3>
                                <div className="space-y-4">
                                    {result.planner.map((item: any, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded">Ch {i+1}</div>
                                            <div>
                                                <h4 className="font-bold">{item.chapter}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{item.plan}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
