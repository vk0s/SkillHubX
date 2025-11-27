'use client';

import Link from "next/link";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserBalance } from "@/lib/actions"; // We'll need a client-friendly way or fetch this via prop/effect

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);

  // Note: Server actions can be called from client components
  // But strictly speaking, it's better to pass data down or use SWR/React Query.
  // For simplicity we will use useEffect to call the server action if authenticated.

  useEffect(() => {
      if (userId) {
          // This assumes getUserBalance is a server action marked with 'use server'
          // We need to import it properly.
          // However, importing server action directly in client component works in Next.js 14
          import("@/lib/actions").then(mod => {
              mod.getUserBalance().then(bal => setBalance(bal));
          });
      }
  }, [userId]);

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Content", href: "/contents" },
    { label: "Upload", href: "/upload" },
    { label: "AI Helper", href: "/ai-helper" },
  ];

  // We need to know the role.
  // Clerk publicMetadata can store this, but we are using our DB.
  // We can fetch role or put it in session claims.
  // For now, let's assume we can check role via a prop or a separate fetch,
  // OR we just show the link and let the page redirect if unauthorized.
  // We'll optimistically show Admin links if we detect role in metadata or just generic.

  // Actually, let's just show them. Page protection is key.

  return (
    <nav className="fixed top-0 w-full z-50 glassmorphism px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold neon-text">SkillHubX</Link>
        <div className="hidden md:flex gap-6 ml-8">
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`hover:text-cyan-400 transition-colors ${pathname === item.href ? 'text-cyan-400' : 'text-gray-300'}`}
                >
                    {item.label}
                </Link>
            ))}
            {/* Conditional Links - ideally we check role here */}
            <Link href="/admin" className="text-gray-300 hover:text-cyan-400">Admin</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoaded && user ? (
            <>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full border border-cyan-500/30 text-sm text-cyan-300">
                    {balance} Coins
                </div>
                <UserButton afterSignOutUrl="/" />
            </>
        ) : (
             <Link href="/sign-in" className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
                 Sign In
             </Link>
        )}
      </div>
    </nav>
  );
}
