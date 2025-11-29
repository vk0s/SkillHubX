"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function AIHelperPage() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("notes");

    const handleGenerate = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const res = await fetch("/api/ai-helper", {
                method: "POST",
                body: JSON.stringify({ mode, text: input, subject: "General" }),
            });
            const data = await res.json();
            setResponse(data.output);
        } catch (e) {
            alert("Error generating content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-8 neon-text">AI Study Assistant</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 mb-4">
                        {['notes', 'summary', 'studyplan', 'analyze'].map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${mode === m ? 'bg-cyan-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Paste your study material here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Generate</>}
                    </button>
                </div>

                {/* Output Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto custom-scrollbar">
                    {response ? (
                        <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                            {response}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Output will appear here...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
