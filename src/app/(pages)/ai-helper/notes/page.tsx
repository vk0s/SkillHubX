'use client';

import { useState } from "react";
// Same as quiz, using dynamic import for server action or wrapping it.
// Since we updated lib/ai-helper.ts to 'use server', we can import functions directly if this was a server component or use the wrapper pattern.
// But direct import in client components from 'use server' files is supported in Next.js.
// However, the bundler might complain if not handled correctly.
// Let's rely on the fact that Next.js handles imports from 'use server' files in client components.
import { generateNotes } from "@/lib/ai-helper";

export default function NotesPage() {
    const [topic, setTopic] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const result = await generateNotes(topic);
        setNotes(result);
        setLoading(false);
    };

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 neon-text">AI Smart Notes</h1>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic (e.g., Photosynthesis, React Hooks, World War II)..."
                    className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none"
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !topic}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? "Generating..." : "Create Notes"}
                </button>
            </div>

            {notes && (
                <div className="glassmorphism p-8 rounded-xl min-h-[500px] prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300">{notes}</pre>
                </div>
            )}
        </div>
    );
}
