import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // --- CIRCUIT BREAKER: Cookie Overflow Protection ---
    // Detect if browser is sending a massive amount of cookies (e.g. > 165 cookies / 5KB)
    // If so, we wipe them all to save the domain from 494 errors.
    const cookieHeader = request.headers.get('cookie') || '';
    const allCookies = request.cookies.getAll();

    if (cookieHeader.length > 4000 || allCookies.length > 20) {
        console.warn('CRITICAL: Massive Cookie Overflow detected. Wiping all cookies to restore access.');

        // Create a clear-site-data response
        const clearResponse = NextResponse.redirect(new URL('/login?reason=session_reset', request.url));

        // Nuking all cookies explicitly
        allCookies.forEach(c => {
            clearResponse.cookies.set(c.name, '', { maxAge: 0, path: '/' });
            clearResponse.cookies.delete(c.name);
        });

        // Nuke usage of 'sb-' cookies specifically just in case
        clearResponse.cookies.getAll().forEach(c => {
            if (c.name.startsWith('sb-')) {
                clearResponse.cookies.set(c.name, '', { maxAge: 0, path: '/' });
            }
        });

        return clearResponse;
    }
    // ---------------------------------------------------

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
                    // Defensive: Don't set too many cookies at once
                    if (cookiesToSet.length > 6) {
                        console.warn('Supabase trying to set excessive cookies. Truncating.');
                        cookiesToSet = cookiesToSet.slice(0, 6);
                    }

                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* call getUser to refresh the auth token
    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Handling
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        // Return standard response, let client handle redirect to avoid loop
        return response
    }

    return response
}
