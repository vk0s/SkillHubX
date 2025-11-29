"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    SkillHubX
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/ai-helper" className="hover:text-white transition-colors">AI Helper</Link>
                        <Link href="/community" className="hover:text-white transition-colors">Community</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">Sign In</Button>
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
}
