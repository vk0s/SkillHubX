'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, BrainCircuit } from "lucide-react";
import ContentCard from "@/components/ContentCard";

// Mock data for trending content since we might not have enough in DB yet
const trendingContent = [
    { id: "1", title: "React 3D Animations", description: "Learn to build 3D websites with Three.js and React Fiber.", type: "VIDEO" as const, price: 50 },
    { id: "2", title: "System Design Guide", description: "Complete PDF guide for system design interviews.", type: "PDF" as const, price: 20 },
    { id: "3", title: "Next.js 14 Course", description: "Master the App Router and Server Actions.", type: "VIDEO" as const, price: 100 },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20 relative">
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter"
        >
            SkillHub<span className="text-cyan-500">X</span>
        </motion.h1>

        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-cyan-200 font-light neon-text"
        >
            AI-Powered Micro-Learning for the Future
        </motion.p>

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
             className="flex flex-wrap justify-center gap-6 mt-10"
        >
            <Link href="/contents" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                <PlayCircle className="w-5 h-5" /> Explore Content
            </Link>
            <Link href="/ai-helper" className="glassmorphism hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" /> AI Helper
            </Link>
            <Link href="/upload" className="glassmorphism hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Upload
            </Link>
        </motion.div>
      </section>

      {/* Trending Section */}
      <section>
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold neon-text">Trending Now</h2>
              <Link href="/contents" className="text-cyan-400 hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingContent.map((c) => (
                  <ContentCard key={c.id} {...c} uploaderName="SkillHubX Official" />
              ))}
          </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glassmorphism p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Secure Streaming</h3>
                <p className="text-gray-400">DRM-style protection with dynamic watermarking to keep your content safe.</p>
            </div>
            <div className="glassmorphism p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">AI Learning</h3>
                <p className="text-gray-400">Generate quizzes, notes, and study plans instantly with Gemini AI.</p>
            </div>
             <div className="glassmorphism p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Earn Rewards</h3>
                <p className="text-gray-400">Get paid in coins for learning. Spend coins to unlock premium content.</p>
            </div>
      </section>
    </div>
  );
}
