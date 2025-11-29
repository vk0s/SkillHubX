"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data.text);
            } else {
                alert("Upload failed");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
             <h1 className="text-3xl font-bold mb-2">Upload Material</h1>
             <p className="text-gray-400 mb-8">Supported: PDF, Images (OCR)</p>

             <div className="w-full max-w-2xl">
                {!result ? (
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 hover:bg-white/5 transition-all cursor-pointer relative">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf,image/*"
                            />
                            {file ? (
                                <div className="flex flex-col items-center text-cyan-400">
                                    <FileText className="w-12 h-12 mb-4" />
                                    <span className="font-bold text-lg">{file.name}</span>
                                    <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-500 mb-4" />
                                    <p className="text-lg font-medium">Click or Drag file here</p>
                                    <p className="text-sm text-gray-500 mt-2">PDF, PNG, JPG up to 10MB</p>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="w-full h-14 bg-cyan-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : "Start Processing"}
                        </button>
                    </form>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 text-green-400 mb-6">
                            <CheckCircle className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">Processing Complete</h2>
                        </div>

                        <h3 className="text-gray-400 mb-4 font-medium uppercase tracking-wider text-sm">Extracted Text Preview</h3>
                        <div className="bg-black/50 p-6 rounded-xl border border-white/5 max-h-96 overflow-y-auto font-mono text-sm text-gray-300 mb-6">
                            {result}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setResult(null)} className="flex-1 h-12 rounded-xl border border-white/20 hover:bg-white/10 font-medium">Upload Another</button>
                            <button onClick={() => window.location.href='/ai-helper'} className="flex-1 h-12 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold">Generate Notes</button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
}
