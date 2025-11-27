import { auth } from "@clerk/nextjs/server";

export default function SuspendedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Account Suspended</h1>
            <p className="text-lg text-gray-400 max-w-md text-center">
                Your account has been suspended due to a violation of our terms of service.
                Please contact support if you believe this is a mistake.
            </p>
            <form action={async () => {
                "use server";
                // Simple sign out handling or link to home
            }}>
                <a href="/" className="mt-8 inline-block px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
                    Return Home
                </a>
            </form>
        </div>
    );
}
