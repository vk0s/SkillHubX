"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Heart, Send } from "lucide-react";

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");

    useEffect(() => {
        fetch("/api/community/posts").then(res => res.json()).then(setPosts);
    }, []);

    const handlePost = async () => {
        if (!newPost) return;
        await fetch("/api/community/posts", {
            method: "POST",
            body: JSON.stringify({ content: newPost })
        });
        setNewPost("");
        // Reload posts
        fetch("/api/community/posts").then(res => res.json()).then(setPosts);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-8 neon-text">Community Feed</h1>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Create Post */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <textarea
                        className="w-full bg-transparent resize-none outline-none text-lg placeholder:text-gray-600"
                        placeholder="Share your study tips or ask a question..."
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <button onClick={handlePost} className="px-6 py-2 bg-cyan-600 rounded-full font-bold text-sm hover:bg-cyan-500">Post</button>
                    </div>
                </div>

                {/* Feed */}
                {posts.map(post => (
                    <div key={post.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            <div>
                                <h3 className="font-bold">{post.author?.name || "Anonymous"}</h3>
                                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>
                        <div className="flex gap-6 text-gray-400 text-sm">
                            <button className="flex items-center gap-2 hover:text-red-400 transition-colors"><Heart className="w-4 h-4" /> {post._count?.likes || 0}</button>
                            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors"><MessageSquare className="w-4 h-4" /> {post._count?.comments || 0}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
