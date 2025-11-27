'use client';

export default function PdfViewer({ url }: { url: string }) {
    return (
        <div className="w-full h-[800px] border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
            <iframe src={url} className="w-full h-full" />
            <div className="p-4 text-center text-gray-400 text-sm">
                PDF Preview Mode
            </div>
        </div>
    );
}
