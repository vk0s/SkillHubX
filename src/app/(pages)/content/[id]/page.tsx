import { db } from "@/lib/db";
import { protect } from "@/lib/protect";
import VideoPlayer from "@/components/VideoPlayer";
import PdfViewer from "@/components/PdfViewer";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function ContentViewerPage({ params }: { params: { id: string } }) {
    await protect();

    // We should check if user owns content or has paid, but for now we assume free access or already unlocked
    const content = await db.content.findUnique({
        where: { id: params.id },
        include: { uploader: true }
    });

    if (!content) notFound();

    // Check transaction if price > 0 (skipped for MVP simplicity, assume "unlocked")

    return (
        <div className="py-10 max-w-5xl mx-auto">
             <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
                <p className="text-gray-400">{content.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span>Uploaded by: {content.uploader.email}</span>
                    <span>Type: {content.type}</span>
                </div>
            </div>

            <div className="glassmorphism p-4 rounded-xl">
                {content.type === "VIDEO" ? (
                    <VideoPlayer url={content.url} contentId={content.id} />
                ) : (
                    <PdfViewer url={content.url} />
                )}
            </div>
        </div>
    );
}
