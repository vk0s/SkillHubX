import { Sidebar } from "@/components/Sidebar";
import { AiHelperClient } from "@/components/AiHelperClient";
import { getSelf } from "@/lib/auth";

export default async function AIHelperPage() {
    const user = await getSelf();

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar role={user?.role} />
            <div className="flex-1 lg:pl-64">
                <AiHelperClient />
            </div>
        </div>
    );
}
