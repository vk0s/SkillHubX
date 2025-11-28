import { db } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import { promoteToAdmin, demoteToUser, toggleSuspension } from "@/lib/actions";
import { ShieldCheck, UserMinus, ScrollText, Settings, Ban, CheckCircle } from "lucide-react";
import { protectSuperAdmin } from "@/lib/protect";
import { getSelf } from "@/lib/auth";

export default async function SuperAdminPage() {
    await protectSuperAdmin();
    const currentUser = await getSelf();
    const users = await db.user.findMany();

    // Mock logs
    const systemLogs = [
        { time: "10:23 AM", action: "System Backup Completed", status: "Success" },
        { time: "09:45 AM", action: "New Admin Promoted", status: "Info" },
        { time: "08:12 AM", action: "Database Optimization", status: "Success" },
    ];

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar role={currentUser?.role} />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Super Admin Panel</h1>
                        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 text-sm font-medium">
                            <Settings className="w-4 h-4" /> Global Settings
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                        <div className="xl:col-span-2">
                             <h2 className="text-xl font-bold mb-4">User Management</h2>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="h-12 px-4 text-left font-medium">Name</th>
                                            <th className="h-12 px-4 text-left font-medium">Email</th>
                                            <th className="h-12 px-4 text-left font-medium">Role</th>
                                    <th className="h-12 px-4 text-left font-medium">Status</th>
                                            <th className="h-12 px-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 font-medium">{user.name}</td>
                                                <td className="p-4">{user.email}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${user.role === 'SUPERADMIN' ? 'bg-primary text-primary-foreground' : user.role === 'ADMIN' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                        {user.role}
                                                    </span>
                                        </td>
                                        <td className="p-4">
                                            {user.isSuspended ? (
                                                <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                                                    <Ban className="w-3 h-3" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {user.role !== 'SUPERADMIN' && (
                                                        <div className="flex justify-end gap-2">
                                                            {user.role !== 'ADMIN' && (
                                                                <form action={async () => {
                                                                    "use server";
                                                                    await promoteToAdmin(user.id);
                                                                }}>
                                                                    <button title="Promote to Admin" className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20">
                                                                        <ShieldCheck className="h-4 w-4" />
                                                                    </button>
                                                                </form>
                                                            )}
                                                            <form action={async () => {
                                                                "use server";
                                                                await demoteToUser(user.id);
                                                            }}>
                                                                <button title="Demote to User" className="h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500/20">
                                                                    <UserMinus className="h-4 w-4" />
                                                                </button>
                                                            </form>
                                                    <form action={async () => {
                                                        "use server";
                                                        await toggleSuspension(user.id);
                                                    }}>
                                                        <button
                                                            title={user.isSuspended ? "Unsuspend User" : "Suspend User"}
                                                            className={`h-8 w-8 rounded-full flex items-center justify-center hover:opacity-80 transition ${user.isSuspended ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                                                        >
                                                            {user.isSuspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                        </button>
                                                    </form>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* System Logs */}
                        <div className="xl:col-span-1">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <ScrollText className="w-5 h-5 text-primary" /> System Logs
                            </h2>
                            <div className="bg-card border rounded-lg p-4 space-y-4 shadow-sm">
                                {systemLogs.map((log, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm pb-4 border-b last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{log.action}</p>
                                            <p className="text-xs text-muted-foreground">{log.time}</p>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                                            {log.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
