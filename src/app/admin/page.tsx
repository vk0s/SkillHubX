import SidebarAdmin from "@/components/SidebarAdmin";
import { protectAdmin } from "@/lib/protect";
import { db } from "@/lib/db";
import { approveContent, rejectContent, suspendUser } from "@/lib/actions";
import { Check, X, AlertTriangle, PlayCircle, FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
    await protectAdmin();

    const pendingContent = await db.content.findMany({
        where: { status: "PENDING" },
        include: { uploader: true },
        orderBy: { createdAt: "desc" }
    });

    const stats = {
        users: await db.user.count(),
        content: await db.content.count(),
        pending: pendingContent.length
    };

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin role="ADMIN" />
            <div className="ml-64 p-8 w-full">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glassmorphism p-6 rounded-2xl border border-white/5">
                        <h3 className="text-gray-400 mb-2 font-medium">Total Users</h3>
                        <p className="text-4xl font-bold text-white">{stats.users}</p>
                    </div>
                    <div className="glassmorphism p-6 rounded-2xl border border-white/5">
                        <h3 className="text-gray-400 mb-2 font-medium">Total Content</h3>
                        <p className="text-4xl font-bold text-white">{stats.content}</p>
                    </div>
                    <div className="glassmorphism p-6 rounded-2xl border border-white/5 bg-orange-500/5">
                        <h3 className="text-orange-300 mb-2 font-medium">Pending Reviews</h3>
                        <p className="text-4xl font-bold text-orange-400">{stats.pending}</p>
                    </div>
                </div>

                {/* Pending Content List */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Pending Approval
                </h2>
                <div className="space-y-4">
                    {pendingContent.map((item) => (
                        <div key={item.id} className="glassmorphism p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-6">
                                {/* Thumbnail Preview */}
                                <div className="w-32 h-20 bg-black/50 rounded-lg flex items-center justify-center border border-gray-800">
                                    {item.type === "VIDEO" ? <PlayCircle className="text-cyan-500"/> : <FileText className="text-orange-500"/>}
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-white mb-1">
                                        <Link href={`/content/${item.id}`} className="hover:underline">{item.title}</Link>
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                                    <div className="text-xs text-gray-500 mt-2 flex gap-4">
                                        <span className="text-cyan-400">@{item.uploader.email}</span>
                                        <span>{item.type}</span>
                                        <span>{item.price} Coins</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <form action={async () => { 'use server'; await approveContent(item.id); }}>
                                    <button className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-2 border border-green-500/20">
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                </form>
                                <form action={async () => { 'use server'; await rejectContent(item.id); }}>
                                    <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-2 border border-red-500/20">
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {pendingContent.length === 0 && (
                        <div className="text-center py-12 text-gray-500 glassmorphism rounded-2xl border border-dashed border-gray-800">
                            No pending content to review.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
