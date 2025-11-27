'use client';

export default function PdfViewer({ url }: { url: string }) {
    return (
        <div className="w-full h-[800px] border border-gray-700 rounded-lg overflow-hidden">
            <iframe src={url} className="w-full h-full" />
        </div>
    );
}
