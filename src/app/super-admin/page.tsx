import { db } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";

export default async function SuperAdminPage() {
    const users = await db.user.findMany();

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8">Super Admin - Manage Users</h1>

                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="h-12 px-4 text-left font-medium">Name</th>
                                    <th className="h-12 px-4 text-left font-medium">Email</th>
                                    <th className="h-12 px-4 text-left font-medium">Role</th>
                                    <th className="h-12 px-4 text-left font-medium">ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === 'SUPERADMIN' ? 'bg-primary text-primary-foreground' : user.role === 'ADMIN' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-xs">{user.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
