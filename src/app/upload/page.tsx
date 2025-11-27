import { Sidebar } from "@/components/Sidebar";
import { UploadCard } from "@/components/UploadCard";
import { syncUser } from "@/lib/actions";
import { getSelf } from "@/lib/auth";

export default async function UploadPage() {
    await syncUser(); // Ensure user exists in DB
    const user = await getSelf();

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar role={user?.role} />
            <div className="flex-1 lg:pl-64">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8 text-center">Upload Content</h1>
                    <UploadCard />
                </div>
            </div>
        </div>
    );
}
