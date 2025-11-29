"use client";

import { uploadContent } from "@/lib/actions";
// @ts-ignore
import { useFormStatus, useFormState } from "react-dom";
import { useState } from "react";
import { Upload } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
            {pending ? "Uploading..." : "Upload Content"}
        </button>
    );
}

const initialState = {
    message: "",
};

export function UploadCard() {
    const [state, formAction] = useFormState(uploadContent, initialState);

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow glassmorphism p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload New Content</h2>
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input name="title" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea name="description" required className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select name="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="VIDEO">Video (MP4)</option>
                            <option value="PDF">PDF Document</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price ($)</label>
                        <input name="price" type="number" min="0" defaultValue="0" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">File</label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
                        <input name="file" type="file" accept=".mp4,.pdf" required className="opacity-0 absolute w-full h-full cursor-pointer inset-0" />
                    </div>
                </div>

                <SubmitButton />
                {state?.message && (
                    <p className={`text-sm text-center ${state.message.includes("Success") ? "text-green-500" : "text-red-500"}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    );
}
