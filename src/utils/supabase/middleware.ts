import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
                    // 1. STANDARD: Update request cookies for Server Components
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value)
                    })

                    // 2. RESPONSE: Prepare response
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })

                    // 3. SAFE DEDUPLICATION ONLY (No Strict Limits)
                    // We removed the 20-cookie limit because it was breaking valid huge sessions (causing logouts).
                    // We now rely on the "Metadata Sanitizer" in the app to fix the root cause (huge profiles),
                    // and the Client Scrubber to handle 494 errors.

                    // Deduplicate by name (Last Write Wins)
                    const uniqueMap = new Map();
                    cookiesToSet.forEach(c => uniqueMap.set(c.name, c));
                    const uniqueCookies = Array.from(uniqueMap.values());

                    // 4. Apply Final Filtered Cookies
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
