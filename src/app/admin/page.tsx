"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the proper admin dashboard
        router.replace('/dashboard/admin');
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 dark:border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Redirecting to Admin Dashboard...</p>
            </div>
        </div>
    );
}
