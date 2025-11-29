import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Users, Trophy } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />

        <div className="z-10 max-w-4xl px-4 space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Study Smarter with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Upload PDFs, Generate Notes, Take AI Mock Tests, and Compete with Friends. All in one platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link href="/dashboard" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-cyan-600 px-8 font-medium text-white transition-all duration-300 hover:bg-cyan-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <span className="mr-2">Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/api/auth/signin" className="inline-flex h-12 items-center justify-center rounded-md border border-gray-800 bg-black/50 px-8 font-medium text-gray-300 transition-colors hover:bg-white/10 backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-black/50">
        <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { icon: BrainCircuit, title: "AI Helper", desc: "Instantly summarize texts and generate study plans." },
                { icon: BookOpen, title: "Note Gen", desc: "Turn PDFs into structured, easy-to-read notes." },
                { icon: Trophy, title: "Mock Tests", desc: "AI-generated quizzes to test your knowledge." },
                { icon: Users, title: "Community", desc: "Share notes and compete on the leaderboard." },
            ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-500/50 transition-colors">
                    <f.icon className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-gray-400">{f.desc}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}
