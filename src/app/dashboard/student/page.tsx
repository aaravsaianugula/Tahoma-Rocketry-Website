"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentDashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect students to the main dashboard
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-400 font-medium">Redirecting to Mission Control...</p>
            </div>
        </div>
    );
}
