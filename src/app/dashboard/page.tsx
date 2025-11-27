import { db } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { FileText, PlayCircle } from "lucide-react";
import { getSelf } from "@/lib/auth";

export default async function DashboardPage() {
    const user = await getSelf();
    const contents = await db.content.findMany({
        where: { status: "APPROVED" },
        include: { uploader: true }
    });

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar role={user?.role} />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contents.map((content) => (
                            <Link href={`/content/${content.id}`} key={content.id} className="group">
                                <div className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow glassmorphism hover:ring-2 hover:ring-primary transition-all">
                                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                                        {content.type === "VIDEO" ? (
                                            <PlayCircle className="w-12 h-12 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <FileText className="w-12 h-12 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                                        )}
                                        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            {content.type}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{content.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{content.description}</p>
                                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>By {content.uploader.name || "Unknown"}</span>
                                            <span>${content.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {contents.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No content available yet. Be the first to upload!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
