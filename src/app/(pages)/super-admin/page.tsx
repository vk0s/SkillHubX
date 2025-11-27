import SidebarAdmin from "@/components/SidebarAdmin";
import { protectSuperAdmin } from "@/lib/protect";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function makeAdmin(userId: string) {
    'use server';
    await db.user.update({
        where: { id: userId },
        data: { role: "ADMIN" }
    });
    // Create Admin profile if not exists
    await db.admin.create({
        data: { userId: userId, canApproveContent: true }
    }).catch(() => {}); // Ignore if already exists (unique constraint)

    revalidatePath("/super-admin");
}

async function removeAdmin(userId: string) {
    'use server';
    await db.user.update({
        where: { id: userId },
        data: { role: "USER" }
    });
    await db.admin.deleteMany({ where: { userId } });
    revalidatePath("/super-admin");
}

export default async function SuperAdminPage() {
    await protectSuperAdmin();

    const users = await db.user.findMany({
        orderBy: { role: 'asc' } // Show admins/superadmins maybe? actually USER < ADMIN < SUPERADMIN alphabetically?
        // Let's just list all users
    });

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin role="SUPERADMIN" />
            <div className="ml-64 p-8 w-full">
                <h1 className="text-3xl font-bold mb-8">Super Admin Panel</h1>

                <div className="glassmorphism rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Wallet</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5">
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            user.role === 'SUPERADMIN' ? 'bg-purple-900 text-purple-300' :
                                            user.role === 'ADMIN' ? 'bg-cyan-900 text-cyan-300' :
                                            'bg-gray-800 text-gray-300'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.walletBalance}</td>
                                    <td className="p-4">
                                        {user.role === 'USER' && (
                                            <form action={async () => { 'use server'; await makeAdmin(user.id); }}>
                                                <button className="text-cyan-400 hover:underline text-sm">Make Admin</button>
                                            </form>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <form action={async () => { 'use server'; await removeAdmin(user.id); }}>
                                                <button className="text-red-400 hover:underline text-sm">Remove Admin</button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
