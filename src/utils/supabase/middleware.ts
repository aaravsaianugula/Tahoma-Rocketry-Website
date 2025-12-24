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

                    // 3. SMART FILTER: Deduplicate & Limit Response Cookies
                    // The "165 cookies" bug happens when the array grows unchecked.
                    // We enforce a hard limit on how many 'Set-Cookie' headers we send back.

                    // A. Deduplicate by name (Last Write Wins)
                    const uniqueMap = new Map();
                    cookiesToSet.forEach(c => uniqueMap.set(c.name, c));
                    let uniqueCookies = Array.from(uniqueMap.values());

                    // B. Safety Limit (Max 20)
                    // Relaxed from 10 to 20 to accommodate larger Auth tokens.
                    if (uniqueCookies.length > 20) {
                        // Prioritize "DELETE" operations (logout depends on this)
                        const deletes = uniqueCookies.filter(c => c.value === '' || c.options?.maxAge === 0);
                        const sets = uniqueCookies.filter(c => c.value !== '' && (c.options?.maxAge === undefined || c.options?.maxAge > 0));

                        // Fill remaining slots with the most recent "sets"
                        const slotsForSets = 20 - deletes.length;
                        const safeSets = sets.slice(Math.max(0, sets.length - slotsForSets));

                        uniqueCookies = [...deletes, ...safeSets].slice(0, 20);
                    }

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
