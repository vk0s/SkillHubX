import { db } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ContentPage({ params }: { params: { id: string } }) {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) redirect("/sign-in");

    const content = await db.content.findUnique({
        where: { id: params.id },
        include: { uploader: true }
    });

    if (!content) return <div>Content not found</div>;

    // Check if approved or owner
    // In real app we check role too
    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (content.status !== "APPROVED" && content.uploaderId !== dbUser?.id && dbUser?.role !== "ADMIN" && dbUser?.role !== "SUPERADMIN") {
        return <div className="p-8 text-center text-red-500">This content is pending approval.</div>;
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8 max-w-4xl">
                    <div className="mb-6">
                        <span className="text-sm text-primary font-bold tracking-wide uppercase">{content.type}</span>
                        <h1 className="text-3xl font-bold mt-2">{content.title}</h1>
                        <p className="text-muted-foreground mt-2">{content.description}</p>
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-2xl glassmorphism border-2 border-primary/20">
                        {content.type === "VIDEO" ? (
                            <VideoPlayer url={content.url} userEmail={userEmail} contentId={content.id} />
                        ) : (
                            <iframe src={content.url} className="w-full h-[600px]" />
                        )}
                    </div>

                    <div className="mt-8 p-6 rounded-lg bg-card border">
                        <h3 className="font-semibold mb-2">Content Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Uploader:</span>
                                <span className="ml-2 font-medium">{content.uploader.name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Price:</span>
                                <span className="ml-2 font-medium">${content.price}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`ml-2 font-bold ${content.status === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}`}>{content.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
