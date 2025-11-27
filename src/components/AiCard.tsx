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
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="glassmorphism p-6 rounded-xl cursor-pointer h-full flex flex-col hover:border-cyan-500/50 transition-colors"
            >
                <div className="mb-4 text-cyan-400">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 text-sm flex-grow">{description}</p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                    Try Now <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </motion.div>
        </Link>
    );
}
