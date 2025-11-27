'use client';

import { uploadContent } from "@/lib/actions";
// @ts-ignore - useFormState in Next 14 can be experimental or from react-dom
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Processing Upload...
                </span>
            ) : "Upload Content"}
        </button>
    );
}

const initialState = {
    message: "", // Fixed: initialized as empty string
};

export default function UploadForm() {
    const [state, formAction] = useFormState(uploadContent, initialState);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl mx-auto glassmorphism p-8 rounded-2xl border border-white/5">
            <h2 className="text-3xl font-bold mb-8 text-center neon-text">Share Your Skill</h2>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g., Advanced React Patterns"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe what learners will gain..."
                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Content Type</label>
                    <div className="relative">
                        <select
                            name="type"
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="VIDEO">Video (MP4)</option>
                            <option value="PDF">PDF Document</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Price (Coins)</label>
                    <input
                        name="price"
                        type="number"
                        min="0"
                        defaultValue="0"
                        required
                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">File Upload</label>
                 <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors bg-black/20">
                     <input
                        name="file"
                        type="file"
                        accept=".mp4,.pdf"
                        required
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/30 file:text-cyan-300 hover:file:bg-cyan-900/50 cursor-pointer"
                     />
                     <p className="text-xs text-gray-500 mt-2">MP4 or PDF only. Max 500MB.</p>
                 </div>
            </div>

            <SubmitButton />

            {state?.message && (
                <div className={`p-4 rounded-lg text-center font-medium ${state.message.includes("Success") ? "bg-green-900/30 text-green-400 border border-green-500/30" : "bg-red-900/30 text-red-400 border border-red-500/30"}`}>
                    {state.message}
                </div>
            )}
        </form>
    );
}
