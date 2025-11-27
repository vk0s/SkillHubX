import Link from "next/link";
import { PlayCircle, FileText } from "lucide-react";

interface ContentCardProps {
    id: string;
    title: string;
    description: string;
    type: "VIDEO" | "PDF";
    price: number;
    uploaderName?: string;
}

export default function ContentCard({ id, title, description, type, price, uploaderName }: ContentCardProps) {
    return (
        <Link href={`/content/${id}`}>
            <div className="glassmorphism rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group h-full flex flex-col">
                <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
                    {type === "VIDEO" ? (
                        <PlayCircle className="w-16 h-16 text-cyan-500 opacity-80 group-hover:scale-110 transition-transform" />
                    ) : (
                        <FileText className="w-16 h-16 text-orange-400 opacity-80 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">
                        {type}
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 text-white">{title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3 flex-grow">{description}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs text-gray-500">By {uploaderName || "Unknown"}</span>
                        <span className="text-cyan-400 font-bold">{price === 0 ? "Free" : `${price} Coins`}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
