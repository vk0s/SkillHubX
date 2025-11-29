"use client";

import { useState } from "react";
import { Loader2, Send, FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIHelperPage() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("notes");
    const [uploadId, setUploadId] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!input && !uploadId) return;
        setLoading(true);
        try {
            const res = await fetch("/api/ai-helper", {
                method: "POST",
                body: JSON.stringify({ mode, text: input, uploadId }),
            });
            const data = await res.json();
            setResponse(data.output);
        } catch (e) {
            alert("Error generating content");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setUploadId(data.uploadId);
                setInput((prev) => prev + "\n[File Uploaded: " + e.target.files![0].name + "]");
            }
        } catch(e) {
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex gap-6">
            {/* Left Panel: Input */}
            <div className="w-1/2 flex flex-col gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 glassmorphism">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">Input & Upload</h2>

                <div className="flex gap-2">
                    {['notes', 'mcq', 'studyplan'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${mode === m ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors relative group">
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <FileUp className="w-10 h-10 mx-auto mb-2 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <p className="text-gray-400">Drag & Drop PDF or Click to Upload</p>
                </div>

                <textarea
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Or type your text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-lg hover:opacity-90 shadow-lg"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                    Generate with AI
                </Button>
            </div>

            {/* Right Panel: Output */}
            <div className="w-1/2 flex flex-col p-6 rounded-3xl bg-white/5 border border-white/10 glassmorphism relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">AI Response</h2>
                    {response && (
                        <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                            <Download className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
                    {response ? (
                        <div className="whitespace-pre-wrap">{response}</div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <div className="w-16 h-16 rounded-full bg-white/10 mb-4 animate-pulse" />
                            <p>Waiting for generation...</p>
                        </div>
                    )}
                </div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
}
