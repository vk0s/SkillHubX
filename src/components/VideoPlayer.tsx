'use client';

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { rewardUser } from "@/lib/actions";

export default function VideoPlayer({ url, contentId }: { url: string, contentId: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user } = useUser();
    const [progress, setProgress] = useState(0);
    const [rewarded, setRewarded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const p = (video.currentTime / video.duration) * 100;
            setProgress(p);

            if (p >= 95 && !rewarded) {
                setRewarded(true);
                // Trigger reward
                // We use import() to call server action from client component in effect if needed, or pass it as prop
                // But server actions imported directly work.
                // We need to handle the promise.
                import("@/lib/actions").then(mod => {
                    mod.rewardUser(10, `Watched content ${contentId}`);
                });
                alert("You earned 10 coins!");
            }
        };

        // Disable right click
        const handleContextMenu = (e: Event) => e.preventDefault();

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("contextmenu", handleContextMenu);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [rewarded, contentId]);

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 group">
            <video
                ref={videoRef}
                src={url}
                controlsList="nodownload"
                className="w-full h-full object-contain"
                controls
            />

            {/* Watermark */}
            {user && (
                <div className="absolute top-4 left-4 text-white/20 text-sm font-bold pointer-events-none animate-pulse select-none z-20">
                    {user.emailAddresses[0].emailAddress}
                </div>
            )}

            {/* Moving Watermark Animation could be more complex with CSS/Framer Motion, sticking to simple absolute for now */}

            {rewarded && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-30">
                     {/* Confetti or simple success message */}
                     <div className="text-4xl animate-bounce">🎉 +10 Coins!</div>
                </div>
            )}
        </div>
    );
}
