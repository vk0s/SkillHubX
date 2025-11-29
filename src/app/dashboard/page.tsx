import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, BookOpen, Zap, Trophy, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    let user = await db.user.findUnique({
        where: { clerkId: userId },
        include: {
            mockTests: { orderBy: { createdAt: 'desc' }, take: 3 },
            notes: { orderBy: { createdAt: 'desc' }, take: 3 }
        }
    });

    if (!user) {
        const clerkUser = await currentUser();
        if (clerkUser) {
            try {
                user = await db.user.create({
                    data: {
                        clerkId: userId,
                        email: clerkUser.emailAddresses[0].emailAddress,
                    },
                    include: {
                        mockTests: true,
                        notes: true
                    }
                });
            } catch (e) {
                // Handle race condition if user created in parallel
                user = await db.user.findUnique({
                    where: { clerkId: userId },
                    include: {
                        mockTests: { orderBy: { createdAt: 'desc' }, take: 3 },
                        notes: { orderBy: { createdAt: 'desc' }, take: 3 }
                    }
                });
            }
        }
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">Track your progress and rewards</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-6 py-3 rounded-2xl border border-yellow-500/30">
                    <Trophy className="text-yellow-500 w-6 h-6" />
                    <div>
                        <p className="text-xs text-yellow-500 font-bold uppercase">Wallet Balance</p>
                        <p className="text-2xl font-bold">{user.walletBalance} pts</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Activity className="w-8 h-8 text-cyan-400 mb-4" />
                    <h3 className="text-gray-400">Current Streak</h3>
                    <p className="text-3xl font-bold">{user.currentStreak} Days</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-gray-400">Notes Generated</h3>
                    <p className="text-3xl font-bold">{user.notes.length}</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <Zap className="w-8 h-8 text-green-400 mb-4" />
                    <h3 className="text-gray-400">Tests Taken</h3>
                    <p className="text-3xl font-bold">{user.mockTests.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {user.mockTests.map(test => (
                            <div key={test.id} className="flex justify-between items-center p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                                <div>
                                    <p className="font-bold text-sm">Mock Test: {test.topic}</p>
                                    <p className="text-xs text-gray-500">{new Date(test.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="text-green-400 font-bold">{test.score}/{test.totalQuestions}</span>
                            </div>
                        ))}
                        {user.notes.map(note => (
                            <div key={note.id} className="flex justify-between items-center p-4 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                                <div>
                                    <p className="font-bold text-sm">Note: {note.topic}</p>
                                    <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="text-purple-400 text-xs font-bold">VIEW</span>
                            </div>
                        ))}
                        {user.mockTests.length === 0 && user.notes.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No recent activity.</p>
                        )}
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20">
                    <h3 className="text-xl font-bold mb-6">Recommended Study Plan</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                            <div>
                                <h4 className="font-bold">Review Weak Areas</h4>
                                <p className="text-sm text-gray-400 mt-1">Based on your last mock test, focus on 'Quantum Physics basics'.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                            <div>
                                <h4 className="font-bold">Take a Pop Quiz</h4>
                                <p className="text-sm text-gray-400 mt-1">Generate a quick 10-question quiz on History.</p>
                            </div>
                        </div>
                        <Link href="/ai-helper" className="block w-full py-3 mt-6 text-center rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-colors">
                            Start AI Session
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
