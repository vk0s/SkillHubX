'use client';

import { useState } from "react";
import { generateNotes } from "@/lib/ai-helper";
import { Loader2, Download, Sparkles } from "lucide-react";

export default function NotesPage() {
    const [topic, setTopic] = useState("");
    const [examMode, setExamMode] = useState(false);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const result = await generateNotes(topic, examMode);
        setNotes(result);
        setLoading(false);
    };

    return (
        <div className="py-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 neon-text">AI Smart Notes</h1>
            <p className="text-gray-400 mb-8">Generate comprehensive revision notes or high-scoring exam cheat sheets instantly.</p>

            <div className="glassmorphism p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-grow w-full">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter topic (e.g., Quantum Mechanics, The French Revolution)..."
                        className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5 whitespace-nowrap cursor-pointer" onClick={() => setExamMode(!examMode)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${examMode ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                         {examMode && <Sparkles className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-bold ${examMode ? 'text-purple-400' : 'text-gray-400'}`}>High Scoring Mode</span>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !topic}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-cyan-900/20 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Notes"}
                </button>
            </div>

            {notes && (
                <div className="glassmorphism p-10 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                    <button
                        onClick={() => window.print()}
                        className="absolute top-6 right-6 p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Print / Save as PDF"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-cyan-400 prose-a:text-cyan-400 prose-strong:text-white">
                        {/* Simple markdown rendering or just pre-wrap */}
                        <div dangerouslySetInnerHTML={{ __html: notes.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^# (.*$)/gm, '<h1>$1</h1>').replace(/^## (.*$)/gm, '<h2>$1</h2>') }} />
                    </div>
                </div>
            )}
        </div>
    );
}
