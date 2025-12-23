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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    console.log('Middleware Path:', request.nextUrl.pathname);
    console.log('Middleware User:', user ? user.email : 'No User');

    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        console.log('Middleware Redirecting to Login');
        // return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based protection: Admin only
    if (user && request.nextUrl.pathname.startsWith('/dashboard/admin')) {
        const userRole = user.user_metadata?.role;
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/student', request.url));
        }
    }

    return response
}
