import Link from "next/link";
import { LayoutDashboard, Upload, Users, Settings, ShieldAlert } from "lucide-react";

export default function SidebarAdmin({ role }: { role: "ADMIN" | "SUPERADMIN" }) {
    return (
        <aside className="w-64 glassmorphism h-screen fixed left-0 top-0 pt-20 border-r border-gray-800">
            <div className="px-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-2">{role === "SUPERADMIN" ? "Super Admin" : "Admin Panel"}</h2>
                <p className="text-xs text-gray-400">Manage your platform</p>
            </div>

            <nav className="space-y-2 px-4">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link href="/admin?tab=uploads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                    Review Uploads
                </Link>
                {role === "SUPERADMIN" && (
                    <>
                        <Link href="/super-admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            Super Admin
                        </Link>
                         <Link href="/super-admin?tab=users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                            <Users className="w-5 h-5" />
                            Manage Users
                        </Link>
                    </>
                )}
            </nav>
        </aside>
    );
}
