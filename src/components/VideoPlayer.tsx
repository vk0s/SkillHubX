'use client';

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { rewardForWatch } from "@/lib/actions";

export default function VideoPlayer({ url, contentId }: { url: string, contentId: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { user, isLoaded } = useUser();
    const [rewarded, setRewarded] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Floating watermark position
    const [pos, setPos] = useState({ x: 10, y: 10 });
    const [direction, setDirection] = useState({ x: 1, y: 1 });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Watermark movement animation
    useEffect(() => {
        if (!mounted) return;
        const interval = setInterval(() => {
            setPos(prev => {
                const newX = prev.x + direction.x * 2; // speed
                const newY = prev.y + direction.y * 2;

                // Bounce logic (simple approximation)
                let nextDir = { ...direction };
                if (newX > 800 || newX < 0) nextDir.x *= -1; // Mock boundaries
                if (newY > 400 || newY < 0) nextDir.y *= -1;

                setDirection(nextDir);
                return { x: newX, y: newY };
            });
        }, 50);
        return () => clearInterval(interval);
    }, [direction, mounted]);

    // Reward & Canvas timestamp logic
    useEffect(() => {
        if (!mounted || !isLoaded || !user) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId: number;

        const drawOverlay = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '20px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            // Safe access to user email
            const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "Anonymous";
            ctx.fillText(`${email} - ${new Date().toLocaleTimeString()}`, 50, 50);
            animationFrameId = requestAnimationFrame(drawOverlay);
        };
        drawOverlay();

        const handleTimeUpdate = () => {
            if (!video.duration) return;
            const p = (video.currentTime / video.duration) * 100;

            if (p >= 95 && !rewarded) {
                setRewarded(true);
                rewardForWatch(contentId).then(res => {
                     if(res.success) alert(`You earned 10 coins! New Balance: ${res.newBalance}`);
                });
            }
        };

        const handleContextMenu = (e: Event) => e.preventDefault();

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("contextmenu", handleContextMenu);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("contextmenu", handleContextMenu);
            cancelAnimationFrame(animationFrameId);
        };
    }, [rewarded, contentId, user, isLoaded, mounted]);

    // Prevent hydration mismatch by only rendering user-dependent content after mount
    if (!mounted) {
         return (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
                <div className="flex items-center justify-center h-full text-gray-500">Loading Player...</div>
            </div>
         );
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 group select-none">
            {/* HTML5 Video with Custom Controls suppressed by context menu block */}
            <video
                ref={videoRef}
                src={url}
                controlsList="nodownload"
                className="w-full h-full object-contain"
                controls
            />

            {/* Canvas Overlay for Timestamp */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-50"
            />

            {/* Floating Watermark */}
            {user && (
                <div
                    className="absolute text-white/30 text-lg font-bold pointer-events-none z-20 whitespace-nowrap"
                    style={{ top: `${pos.y}px`, left: `${pos.x}px`, transition: 'top 0.05s, left 0.05s' }}
                >
                    {user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress}
                </div>
            )}

            {/* Reward Animation Overlay */}
            {rewarded && (
                <div className="absolute top-4 right-4 z-30 pointer-events-none animate-bounce">
                     <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-3 py-1 rounded-full text-sm font-bold">
                        🎉 Rewarded
                     </span>
                </div>
            )}
        </div>
    );
}
