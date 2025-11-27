"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, BrainCircuit } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
        >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4">
                SkillHub<span className="text-primary neon-text">X</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                The Future of Micro-Learning.
                <span className="block mt-2">Powered by AI. Secured by Design.</span>
            </p>
        </motion.div>

        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="flex flex-wrap justify-center gap-6 mt-8 z-10"
        >
            <Link href="/dashboard" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105">
                <span className="mr-2">Start Learning</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/upload" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                Upload Content
            </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl px-4 z-10"
        >
            <div className="glassmorphism p-8 rounded-xl text-left space-y-4">
                <div className="p-3 bg-primary/10 w-fit rounded-lg"><PlayCircle className="w-8 h-8 text-primary" /></div>
                <h3 className="text-xl font-bold">Secure Streaming</h3>
                <p className="text-muted-foreground">DRM-style protection with dynamic watermarking to prevent piracy.</p>
            </div>
            <div className="glassmorphism p-8 rounded-xl text-left space-y-4">
                <div className="p-3 bg-primary/10 w-fit rounded-lg"><BrainCircuit className="w-8 h-8 text-primary" /></div>
                <h3 className="text-xl font-bold">AI Helper</h3>
                <p className="text-muted-foreground">Generate quizzes, notes, and study plans instantly with Gemini AI.</p>
            </div>
            <div className="glassmorphism p-8 rounded-xl text-left space-y-4">
                <div className="p-3 bg-primary/10 w-fit rounded-lg"><BookOpen className="w-8 h-8 text-primary" /></div>
                <h3 className="text-xl font-bold">Micro-Learning</h3>
                <p className="text-muted-foreground">Bite-sized video and PDF content for rapid skill acquisition.</p>
            </div>
        </motion.div>
      </section>
    </div>
  );
}
