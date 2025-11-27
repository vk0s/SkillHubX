import { db } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import { updateContentStatus } from "@/lib/actions";
import { Check, X, BarChart, Users, TrendingUp } from "lucide-react";
import { protectAdmin } from "@/lib/protect";
import { getSelf } from "@/lib/auth";

export default async function AdminPage() {
    await protectAdmin();
    const user = await getSelf();

    const pendingContent = await db.content.findMany({
        where: { status: "PENDING" },
        include: { uploader: true }
    });

    // Mock analytics data
    const analytics = [
        { label: "Total Users", value: "1,234", icon: Users, change: "+12%" },
        { label: "Content Uploads", value: "856", icon: BarChart, change: "+5%" },
        { label: "Revenue", value: "$12,450", icon: TrendingUp, change: "+8%" },
    ];

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar role={user?.role} />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8">Admin Review Panel</h1>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {analytics.map((item, i) => (
                            <div key={i} className="p-6 rounded-xl border bg-card shadow-sm glassmorphism">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3>
                                    <item.icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold">{item.value}</span>
                                    <span className="text-xs text-green-500 font-medium">{item.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-bold mb-4">Pending Content Approvals</h2>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="h-12 px-4 text-left font-medium">Title</th>
                                    <th className="h-12 px-4 text-left font-medium">Type</th>
                                    <th className="h-12 px-4 text-left font-medium">Uploader</th>
                                    <th className="h-12 px-4 text-left font-medium">Price</th>
                                    <th className="h-12 px-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingContent.map((content) => (
                                    <tr key={content.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 font-medium">{content.title}</td>
                                        <td className="p-4">{content.type}</td>
                                        <td className="p-4">{content.uploader.name}</td>
                                        <td className="p-4">${content.price}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <form action={async () => {
                                                    "use server";
                                                    await updateContentStatus(content.id, "APPROVED");
                                                }}>
                                                    <button className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20">
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                </form>
                                                <form action={async () => {
                                                    "use server";
                                                    await updateContentStatus(content.id, "REJECTED");
                                                }}>
                                                    <button className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pendingContent.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No pending content reviews.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
