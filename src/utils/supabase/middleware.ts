import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. EMERGENCY CLEANUP: Detect specific cookie explosion (165+ cookies)
    // If we see too many cookies, we use the "Clear-Site-Data" header to nuke them all at once.
    // This is much safer than sending 165 "Set-Cookie" delete headers (which crashes the response).
    const allCookies = request.cookies.getAll();
    if (allCookies.length > 20) {
        console.warn('CRITICAL: Massive Cookie Overflow detected. Sending Clear-Site-Data command.');

        // Redirect to login, but attach the NUCLEAR header.
        const clearResponse = NextResponse.redirect(new URL('/login?reason=overflow_reset', request.url));

        // This header tells modern browsers (Chrome/Edge/Firefox) to verify and delete all cookies for this domain.
        // It works on Localhost (Secure Context).
        clearResponse.headers.set('Clear-Site-Data', '"cookies"');

        return clearResponse;
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Mock Mode Bypass
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return response
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Standard Update
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value)
                    })

                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })

                    // SMART FILTER: Limit Response Cookies to 10 max
                    const uniqueMap = new Map();
                    cookiesToSet.forEach(c => uniqueMap.set(c.name, c));
                    let uniqueCookies = Array.from(uniqueMap.values());

                    if (uniqueCookies.length > 10) {
                        const deletes = uniqueCookies.filter(c => c.value === '' || c.options?.maxAge === 0);
                        const sets = uniqueCookies.filter(c => c.value !== '' && (c.options?.maxAge === undefined || c.options?.maxAge > 0));

                        const slotsForSets = 10 - deletes.length;
                        const safeSets = sets.slice(Math.max(0, sets.length - slotsForSets));

                        uniqueCookies = [...deletes, ...safeSets].slice(0, 10);
                    }

                    uniqueCookies.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* call getUser to refresh the auth token
    await supabase.auth.getUser()

    return response
}
