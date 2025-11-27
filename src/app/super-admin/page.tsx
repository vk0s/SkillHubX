import SidebarAdmin from "@/components/SidebarAdmin";
import { protectSuperAdmin } from "@/lib/protect";
import { db } from "@/lib/db";
import { promoteToAdmin, demoteToUser } from "@/lib/actions";

export default async function SuperAdminPage() {
    await protectSuperAdmin();

    const users = await db.user.findMany({
        orderBy: { role: 'asc' }
    });

    // Mock logs
    const logs = [
        { id: 1, action: "System Started", time: "2 mins ago" },
        { id: 2, action: "Backup Completed", time: "1 hour ago" },
        { id: 3, action: "User Suspended: test@example.com", time: "5 hours ago" },
    ];

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin role="SUPERADMIN" />
            <div className="ml-64 p-8 w-full">
                <h1 className="text-3xl font-bold mb-8">Super Admin Panel</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* User Management */}
                    <div className="glassmorphism rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-gray-800">
                             <h2 className="text-xl font-bold">User Management</h2>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-sm">
                                    <tr>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    user.role === 'SUPERADMIN' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' :
                                                    user.role === 'ADMIN' ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30' :
                                                    'bg-gray-800 text-gray-300'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {user.role === 'USER' && (
                                                    <form action={async () => { 'use server'; await promoteToAdmin(user.id); }}>
                                                        <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold">Promote to Admin</button>
                                                    </form>
                                                )}
                                                {user.role === 'ADMIN' && (
                                                    <form action={async () => { 'use server'; await demoteToUser(user.id); }}>
                                                        <button className="text-red-400 hover:text-red-300 text-xs font-bold">Demote to User</button>
                                                    </form>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Logs */}
                    <div className="glassmorphism rounded-2xl overflow-hidden border border-white/5 h-fit">
                        <div className="p-6 border-b border-gray-800">
                             <h2 className="text-xl font-bold">System Logs</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2 last:border-0">
                                    <span className="text-gray-300 font-mono">{log.action}</span>
                                    <span className="text-gray-500">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Global Settings */}
                <div className="glassmorphism p-8 rounded-2xl border border-white/5">
                    <h2 className="text-xl font-bold mb-6">Global Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Reward Amount (Coins)</label>
                            <input type="number" defaultValue={10} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">AI API Key (Gemini)</label>
                            <input type="password" value="************************" disabled className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            <p className="text-xs text-gray-500 mt-1">Managed via .env</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
