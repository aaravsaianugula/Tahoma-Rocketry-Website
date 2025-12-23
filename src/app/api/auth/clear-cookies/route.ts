import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const cookieStore = await cookies();

    // List of known Supabase cookies to clear
    const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token',
        'sb-localhost-auth-token', // Common locally
        // Add any other specific project prefixes if needed
    ];

    // Also clear any cookie starting with 'sb-' dynamic check
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
        if (cookie.name.startsWith('sb-')) {
            cookiesToClear.push(cookie.name);
        }
    });

    // Unique the list
    const uniqueCookies = [...new Set(cookiesToClear)];

    // Delete them
    uniqueCookies.forEach((name) => {
        cookieStore.delete(name);
    });

    // Redirect to login with a clean slate
    return NextResponse.redirect(new URL("/login", request.url));
}
