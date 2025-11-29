'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AiCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

export default function AiCard({ title, description, href, icon }: AiCardProps) {
    return (
        <Link href={href} className="block h-full">
            <motion.div
                whileHover={{ scale: 1.02, borderColor: 'rgba(6,182,212,0.5)' }}
                className="glassmorphism p-6 rounded-xl cursor-pointer h-full flex flex-col border border-white/5 transition-all"
            >
                <div className="mb-4 text-cyan-400 p-3 bg-cyan-950/30 rounded-lg w-fit">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 text-sm flex-grow leading-relaxed">{description}</p>
                <div className="mt-6 flex items-center text-cyan-400 text-sm font-bold group">
                    Start Generation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </motion.div>
        </Link>
    );
}
