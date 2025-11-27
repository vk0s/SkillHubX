"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block neon-text text-xl">
                SkillHub<span className="text-primary">X</span>
            </span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                <Link href="/upload" className="hover:text-foreground transition-colors">Upload</Link>
                <Link href="/ai-helper" className="hover:text-foreground transition-colors">AI Helper</Link>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {isLoaded && user ? (
                <UserButton afterSignOutUrl="/" />
            ) : (
                <Link href="/sign-in" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                    Sign In
                </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
