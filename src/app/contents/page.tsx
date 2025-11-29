import { db } from "@/lib/db";
import ContentCard from "@/components/ContentCard";

// Helper to fetch contents
async function getContents() {
    return await db.content.findMany({
        where: { status: "APPROVED" },
        include: { uploader: true },
        orderBy: { createdAt: "desc" }
    });
}

export default async function ContentsPage() {
    const contents = await getContents();

    return (
        <div className="py-10">
            <h1 className="text-4xl font-bold mb-2 neon-text">All Content</h1>
            <p className="text-gray-400 mb-10">Explore the latest videos and documents from our community.</p>

            {contents.length === 0 ? (
                <div className="text-center py-32 glassmorphism rounded-xl border border-dashed border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-500 mb-2">No content found yet</h3>
                    <p className="text-gray-600">Be the first to upload amazing content!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contents.map(c => (
                        <ContentCard
                            key={c.id}
                            id={c.id}
                            title={c.title}
                            description={c.description}
                            type={c.type}
                            price={c.price}
                            uploaderName={c.uploader.email}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
