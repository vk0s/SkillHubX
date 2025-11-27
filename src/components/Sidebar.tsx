"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Upload, Bot, Shield, ShieldAlert } from "lucide-react";

interface SidebarProps {
    role?: string;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const items = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", visible: true },
        { href: "/upload", icon: Upload, label: "Upload Content", visible: true },
        { href: "/ai-helper", icon: Bot, label: "AI Helper", visible: true },
        { href: "/admin", icon: Shield, label: "Admin Panel", visible: role === "ADMIN" || role === "SUPERADMIN" },
        { href: "/super-admin", icon: ShieldAlert, label: "Super Admin", visible: role === "SUPERADMIN" },
    ];

    return (
        <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-background/95 backdrop-blur lg:block">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {items.filter(item => item.visible).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
