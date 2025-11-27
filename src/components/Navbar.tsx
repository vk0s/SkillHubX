'use client';

import Link from "next/link";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserBalance } from "@/lib/actions";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);

  // Poll for balance or fetch on mount
  useEffect(() => {
      if (userId) {
          getUserBalance().then(setBalance);
      }
  }, [userId, pathname]); // Refresh on navigation (e.g. after earning)

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "All Content", href: "/contents" },
    { label: "Upload", href: "/upload" },
    { label: "AI Helper", href: "/ai-helper" },
  ];

  const role = user?.publicMetadata?.role as string || "USER";
  // Note: For real security we check DB, but for UI hiding we can use metadata if synced.
  // Since we don't have webhook syncing metadata in this mock, we might need to fetch role from server action or use generic links that redirect.
  // We'll optimistically show Admin if the user has specific email or if we fetched it.
  // For this demo, let's just show links if they are logged in and let page protection handle access.
  // Actually, let's fetch role via server action wrapper if we want to be precise, but standard is checking session claims.

  return (
    <nav className="fixed top-0 w-full z-50 glassmorphism px-6 py-4 flex justify-between items-center border-b border-white/10">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold neon-text tracking-tighter">SkillHub<span className="text-cyan-500">X</span></Link>
        <div className="hidden md:flex gap-6">
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium hover:text-cyan-400 transition-colors ${pathname === item.href ? 'text-cyan-400' : 'text-gray-300'}`}
                >
                    {item.label}
                </Link>
            ))}
            {/* We show these links; middleware/page guards protect them */}
            {userId && (
                <>
                    <Link href="/admin" className="text-sm font-medium text-gray-300 hover:text-neon-purple transition-colors">Admin Panel</Link>
                    <Link href="/super-admin" className="text-sm font-medium text-gray-300 hover:text-red-400 transition-colors">Super Admin</Link>
                </>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoaded && user ? (
            <>
                <div className="hidden md:flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-cyan-500/30">
                    <span className="text-yellow-400">🪙</span>
                    <span className="text-sm font-bold text-white">{balance}</span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </>
        ) : (
             <Link href="/sign-in" className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                 Sign In
             </Link>
        )}
      </div>
    </nav>
  );
}
