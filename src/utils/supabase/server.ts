import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase keys missing. Using Mock Server Client.')
        return {
            auth: {
                getUser: async () => {
                    return {
                        data: {
                            user: {
                                id: 'mock-user-id',
                                email: 'pilot@tahomarocketry.org',
                                user_metadata: { full_name: 'Mock Pilot' }
                            }
                        },
                        error: null
                    }
                }
            },
            from: (table: string) => {
                return {
                    select: (columns: string) => {
                        return {
                            eq: (column: string, value: any) => {
                                return {
                                    gte: (column: string, value: any) => {
                                        return {
                                            order: (column: string, options: any) => {
                                                return { data: [], error: null }
                                            }
                                        }
                                    },
                                    order: (column: string, options: any) => {
                                        return { data: [], error: null }
                                    },
                                    single: async () => {
                                        return { data: null, error: null }
                                    }
                                }
                            },
                            order: (column: string, options: any) => {
                                return { data: [], error: null }
                            }
                        }
                    },
                    insert: (payload: any) => {
                        return {
                            select: () => {
                                const data = Array.isArray(payload) ? payload : [payload];
                                return { data: data, error: null }
                            }
                        }
                    },
                    update: (payload: any) => {
                        return {
                            eq: (column: string, value: any) => {
                                return {
                                    select: () => {
                                        return {
                                            single: async () => {
                                                return { data: payload, error: null }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    delete: () => {
                        return {
                            eq: (column: string, value: any) => {
                                return { error: null }
                            }
                        }
                    }
                }
            }
        } as any
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
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
}
