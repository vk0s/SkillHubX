import Link from "next/link";
import { PlayCircle, FileText, Lock } from "lucide-react";

interface ContentCardProps {
    id: string;
    title: string;
    description: string;
    type: "VIDEO" | "PDF";
    price: number;
    uploaderName?: string;
    status?: "APPROVED" | "PENDING" | "REJECTED";
}

export default function ContentCard({ id, title, description, type, price, uploaderName, status }: ContentCardProps) {
    return (
        <Link href={`/content/${id}`}>
            <div className="glassmorphism rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group h-full flex flex-col relative border border-white/5">
                {status && status !== "APPROVED" && (
                    <div className="absolute top-2 left-2 z-10 bg-yellow-600 text-white text-xs px-2 py-1 rounded font-bold">
                        {status}
                    </div>
                )}
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />

                    {/* Placeholder Thumbnail logic */}
                    {type === "VIDEO" ? (
                        <PlayCircle className="w-16 h-16 text-cyan-500 opacity-80 group-hover:scale-110 transition-transform relative z-10" />
                    ) : (
                        <FileText className="w-16 h-16 text-orange-400 opacity-80 group-hover:scale-110 transition-transform relative z-10" />
                    )}

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white z-10 flex items-center gap-1 border border-white/10">
                        {type}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{description}</p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                        <span className="text-xs text-gray-500 truncate max-w-[50%]">By {uploaderName || "Unknown"}</span>
                        <div className="flex items-center gap-1 text-cyan-400 font-bold">
                            {price === 0 ? "Free" : `${price} Coins`}
                            {price > 0 && <Lock className="w-3 h-3" />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
