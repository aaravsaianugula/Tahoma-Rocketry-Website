import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            // SAFEGUARD: If Supabase tries to set > 25 cookies, something is wrong.
                            // We truncate to prevent the 494 error.
                            if (cookiesToSet.length > 25) {
                                console.warn(`Auth Callback: Truncating ${cookiesToSet.length} cookies to 25 SAFE limit.`);
                                cookiesToSet = cookiesToSet.slice(0, 25);
                            }

                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data?.user) {
            // METADATA SANITIZER:
            // Check if the user has a "poisoned" profile (huge Base64 string in avatar_url)
            // which causes the 165-cookie explosion.
            const metadata = data.user.user_metadata || {};
            if (metadata.avatar_url && metadata.avatar_url.length > 2000) {
                console.warn('CRITICAL: Detected huge avatar_url metadata (~' + metadata.avatar_url.length + ' chars). Sanitizing profile...');

                // Nuke the huge data to stop cookie explosion
                await supabase.auth.updateUser({
                    data: { avatar_url: null }
                });
                console.log('Profile sanitized. Redirecting.');
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
