import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Activity, Zap } from "lucide-react";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            _count: {
                select: { uploads: true, notes: true, mockResults: true }
            },
            mockResults: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Welcome back, <span className="text-cyan-400">{user.name}</span></h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/50 to-black border border-white/10">
                    <h3 className="text-gray-400 mb-2">Total Points</h3>
                    <p className="text-4xl font-bold text-purple-400">{user.points}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-gray-400 mb-2">Uploads</h3>
                    <p className="text-2xl font-bold">{user._count.uploads}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-gray-400 mb-2">Notes Generated</h3>
                    <p className="text-2xl font-bold">{user._count.notes}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-gray-400 mb-2">Tests Taken</h3>
                    <p className="text-2xl font-bold">{user._count.mockResults}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link href="/upload" className="flex items-center gap-4 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><FileText /></div>
                    <div>
                        <h3 className="font-bold">Upload PDF</h3>
                        <p className="text-sm text-gray-400">Convert files to notes</p>
                    </div>
                </Link>
                <Link href="/ai-helper" className="flex items-center gap-4 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><Zap /></div>
                    <div>
                        <h3 className="font-bold">AI Assistant</h3>
                        <p className="text-sm text-gray-400">Ask questions & summaries</p>
                    </div>
                </Link>
                <Link href="/mock-test" className="flex items-center gap-4 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><Activity /></div>
                    <div>
                        <h3 className="font-bold">Take Mock Test</h3>
                        <p className="text-sm text-gray-400">Test your knowledge</p>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-4 text-gray-400 font-medium">Date</th>
                            <th className="p-4 text-gray-400 font-medium">Score</th>
                            <th className="p-4 text-gray-400 font-medium">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.mockResults.map((res) => (
                            <tr key={res.id} className="border-t border-white/5">
                                <td className="p-4">{res.createdAt.toLocaleDateString()}</td>
                                <td className="p-4 font-bold">{res.score}/{res.totalQuestions}</td>
                                <td className="p-4 text-green-400">{Math.round((res.score / res.totalQuestions) * 100)}%</td>
                            </tr>
                        ))}
                        {user.mockResults.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">No tests taken yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
