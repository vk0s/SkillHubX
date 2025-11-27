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
            <h1 className="text-4xl font-bold mb-10 neon-text">All Content</h1>
            {contents.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    No content found. Be the first to upload!
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
                            uploaderName={c.uploader.email} // Using email as name for simplicity
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
