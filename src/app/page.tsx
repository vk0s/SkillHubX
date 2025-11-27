'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, BrainCircuit, ShieldCheck, Trophy, MonitorPlay } from "lucide-react";
import ContentCard from "@/components/ContentCard";

// Mock data for trending content
const trendingContent = [
    { id: "1", title: "React 3D Animations", description: "Learn to build 3D websites with Three.js and React Fiber.", type: "VIDEO" as const, price: 50 },
    { id: "2", title: "System Design Guide", description: "Complete PDF guide for system design interviews.", type: "PDF" as const, price: 20 },
    { id: "3", title: "Next.js 14 Course", description: "Master the App Router and Server Actions.", type: "VIDEO" as const, price: 100 },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
                SkillHub<span className="text-cyan-500 neon-text">X</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
                The AI-Powered Micro-Learning Platform for the Future.
                <span className="block mt-2 text-cyan-200">Learn. Share. Earn.</span>
            </p>
        </motion.div>

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 0.8 }}
             className="flex flex-wrap justify-center gap-6 mt-10 relative z-10"
        >
            <Link href="/contents" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                <PlayCircle className="w-5 h-5" /> Explore Content
            </Link>
            <Link href="/ai-helper" className="glassmorphism hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 border border-white/10">
                <BrainCircuit className="w-5 h-5" /> AI Helper
            </Link>
            <Link href="/upload" className="glassmorphism hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 border border-white/10">
                <BookOpen className="w-5 h-5" /> Upload Content
            </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism p-8 rounded-2xl border border-white/5 relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MonitorPlay className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Secure Streaming</h3>
                <p className="text-gray-400 leading-relaxed">
                    Advanced DRM-style protection with dynamic floating watermarks and canvas overlays to keep your content safe from piracy.
                </p>
            </div>
            <div className="glassmorphism p-8 rounded-2xl border border-white/5 relative group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BrainCircuit className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> AI Learning</h3>
                <p className="text-gray-400 leading-relaxed">
                    Instantly generate quizzes from PDFs, create high-scoring revision notes, and get personalized study plans powered by Gemini AI.
                </p>
            </div>
             <div className="glassmorphism p-8 rounded-2xl border border-white/5 relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2"><Trophy className="w-5 h-5"/> Gamified Rewards</h3>
                <p className="text-gray-400 leading-relaxed">
                    Earn coins for every video you complete. Use your wallet to unlock premium content. Education meets economy.
                </p>
            </div>
      </section>

      {/* Trending Section */}
      <section>
          <div className="flex items-center justify-between mb-8 border-l-4 border-cyan-500 pl-4">
              <h2 className="text-3xl font-bold text-white">Trending Now</h2>
              <Link href="/contents" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
              </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingContent.map((c) => (
                  <ContentCard key={c.id} {...c} uploaderName="SkillHubX Official" />
              ))}
          </div>
      </section>
    </div>
  );
}
