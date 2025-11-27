import SidebarAdmin from "@/components/SidebarAdmin";
import { protectAdmin } from "@/lib/protect";
import { db } from "@/lib/db";
import { approveContent, rejectContent } from "@/lib/actions";
import { Check, X } from "lucide-react";

export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
    await protectAdmin();

    const pendingContent = await db.content.findMany({
        where: { status: "PENDING" },
        include: { uploader: true }
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
                <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="glassmorphism p-6 rounded-xl">
                        <h3 className="text-gray-400 mb-2">Total Users</h3>
                        <p className="text-4xl font-bold">{stats.users}</p>
                    </div>
                    <div className="glassmorphism p-6 rounded-xl">
                        <h3 className="text-gray-400 mb-2">Total Content</h3>
                        <p className="text-4xl font-bold">{stats.content}</p>
                    </div>
                    <div className="glassmorphism p-6 rounded-xl">
                        <h3 className="text-gray-400 mb-2">Pending Reviews</h3>
                        <p className="text-4xl font-bold text-orange-400">{stats.pending}</p>
                    </div>
                </div>

                {/* Pending Content List */}
                <h2 className="text-2xl font-bold mb-4">Pending Approval</h2>
                <div className="space-y-4">
                    {pendingContent.map((item) => (
                        <div key={item.id} className="glassmorphism p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.description}</p>
                                <div className="text-xs text-gray-500 mt-2">
                                    By: {item.uploader.email} | Type: {item.type} | Price: {item.price}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <form action={async () => { 'use server'; await approveContent(item.id); }}>
                                    <button className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded transition-colors">
                                        <Check className="w-5 h-5" />
                                    </button>
                                </form>
                                <form action={async () => { 'use server'; await rejectContent(item.id); }}>
                                    <button className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {pendingContent.length === 0 && (
                        <p className="text-gray-500">No pending content to review.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
