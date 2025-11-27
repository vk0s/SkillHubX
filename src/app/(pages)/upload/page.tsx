import UploadForm from "@/components/UploadForm";
import { protect } from "@/lib/protect";

export default async function UploadPage() {
    await protect();

    return (
        <div className="py-10">
            <UploadForm />
        </div>
    );
}
