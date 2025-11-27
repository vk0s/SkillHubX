'use client';

import { uploadContent } from "@/lib/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "Uploading..." : "Upload Content"}
        </button>
    );
}

export default function UploadForm() {
    return (
        <form action={uploadContent} className="space-y-6 max-w-xl mx-auto glassmorphism p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center neon-text">Upload Content</h2>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                    <select
                        name="type"
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                    >
                        <option value="VIDEO">Video (MP4)</option>
                        <option value="PDF">PDF Document</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Price (Coins)</label>
                    <input
                        name="price"
                        type="number"
                        min="0"
                        defaultValue="0"
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">File</label>
                 <input
                    name="file"
                    type="file"
                    accept=".mp4,.pdf"
                    required
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/30 file:text-cyan-300 hover:file:bg-cyan-900/50"
                 />
            </div>

            <SubmitButton />
        </form>
    );
}
