import { db } from "@/lib/db";
import { protect } from "@/lib/protect";
import VideoPlayer from "@/components/VideoPlayer";
import PdfViewer from "@/components/PdfViewer";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSelf, isAdmin } from "@/lib/auth";

export default async function ContentViewerPage({ params }: { params: { id: string } }) {
    await protect();
    const user = await getSelf();
    const isAdm = await isAdmin();

    const content = await db.content.findUnique({
        where: { id: params.id },
        include: { uploader: true }
    });

    if (!content) notFound();

    // Access control:
    // 1. Approved content is visible to everyone
    // 2. Pending/Rejected only visible to Uploader or Admin
    const canView = content.status === "APPROVED" ||
                    (user && content.uploaderId === user.id) ||
                    isAdm;

    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-gray-400">This content is pending review or has been rejected.</p>
            </div>
        );
    }

    return (
        <div className="py-10 max-w-6xl mx-auto">
             <div className="mb-8 border-b border-gray-800 pb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{content.title}</h1>
                    {content.status !== "APPROVED" && (
                         <span className="px-3 py-1 rounded bg-yellow-600/20 text-yellow-500 text-sm font-bold border border-yellow-600/50">
                             {content.status}
                         </span>
                    )}
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{content.description}</p>
                <div className="flex gap-6 mt-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        Uploaded by: <span className="text-gray-300">{content.uploader.email}</span>
                    </span>
                    <span className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Type: <span className="text-gray-300">{content.type}</span>
                    </span>
                     <span className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Price: <span className="text-gray-300">{content.price} Coins</span>
                    </span>
                </div>
            </div>

            <div className="glassmorphism p-1 rounded-2xl overflow-hidden bg-black/50">
                {content.type === "VIDEO" ? (
                    <VideoPlayer url={content.url} contentId={content.id} />
                ) : (
                    <PdfViewer url={content.url} />
                )}
            </div>
        </div>
    );
}
