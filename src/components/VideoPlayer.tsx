"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
    url: string;
    userEmail: string;
}

export function VideoPlayer({ url, userEmail }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [position, setPosition] = useState({ x: 10, y: 10 });

    useEffect(() => {
        const interval = setInterval(() => {
            const x = Math.random() * 80; // 0-80%
            const y = Math.random() * 80;
            setPosition({ x, y });
        }, 5000); // Move every 5s

        // Disable Context Menu
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const videoEl = videoRef.current;
        if(videoEl) videoEl.addEventListener('contextmenu', handleContextMenu);

        return () => {
            clearInterval(interval);
            if(videoEl) videoEl.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload"
                disablePictureInPicture
            />
            {/* Dynamic Watermark */}
            <div
                className="absolute pointer-events-none text-white/20 text-lg font-bold select-none z-10"
                style={{ top: `${position.y}%`, left: `${position.x}%`, transition: 'all 1s ease-in-out' }}
            >
                {userEmail} - {new Date().toLocaleDateString()}
            </div>

            {/* Hidden overlay to block clicks/screenshots partially */}
            <div className="absolute inset-0 z-0 bg-transparent pointer-events-none mix-blend-overlay opacity-10"
                 style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='100px' width='100px'><text x='0' y='15' fill='white' font-size='10'>${userEmail}</text></svg>")` }}
            ></div>
        </div>
    );
}
