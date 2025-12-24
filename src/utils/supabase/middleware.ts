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
                // SAFE GUARD: Truncate cookies to prevent 494 "Too Large" errors
                setAll(cookiesToSet) {
                    // If Supabase tries to set more than 4 cookies, we only take the last 4.
                    // This prevents the "165 cookies" explosion by physically limiting the list.
                    if (cookiesToSet.length > 4) {
                        cookiesToSet = cookiesToSet.slice(cookiesToSet.length - 4);
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
