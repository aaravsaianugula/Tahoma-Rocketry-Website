import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Simple in-memory store for mock data persistence during dev session
const globalStore = globalThis as any;
if (!globalStore.mockStore) {
    globalStore.mockStore = {
        events: [],
        gallery: [],
        rsvps: []
    };
}
const mockStore = globalStore.mockStore;

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
                                user_metadata: { full_name: 'Mock Pilot', role: 'admin' }
                            }
                        },
                        error: null
                    }
                }
            },
            from: (table: string) => {
                return {
                    select: (columns: string) => {

                        const queryBuilder = {
                            data: mockStore[table] || [],
                            error: null,
                            eq: (column: string, value: any) => {
                                return {
                                    single: async () => {
                                        const item = mockStore[table]?.find((i: any) => i[column] === value);
                                        return { data: item || null, error: null }
                                    }
                                }
                            },
                            gte: (column: string, value: any) => {
                                return {
                                    order: (column: string, options: any) => {
                                        return { data: mockStore[table] || [], error: null }
                                    }
                                }
                            },
                            order: (column: string, options: any) => {
                                return { data: mockStore[table] || [], error: null }
                            }
                        };
                        return queryBuilder;
                    },
                    insert: (payload: any) => {
                        return {
                            select: () => {
                                const data = Array.isArray(payload) ? payload : [payload];
                                // Add IDs if missing
                                const dataWithIds = data.map((item: any) => ({
                                    ...item,
                                    id: item.id || Math.random().toString(36).substr(2, 9),
                                    created_at: new Date().toISOString()
                                }));

                                if (!mockStore[table]) mockStore[table] = [];
                                mockStore[table].push(...dataWithIds);

                                const result = { data: dataWithIds, error: null };
                                return {
                                    ...result,
                                    single: () => {
                                        return { data: dataWithIds[0] || null, error: null }
                                    }
                                }
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
                                                if (mockStore[table]) {
                                                    const index = mockStore[table].findIndex((i: any) => i[column] === value);
                                                    if (index !== -1) {
                                                        mockStore[table][index] = { ...mockStore[table][index], ...payload };
                                                        return { data: mockStore[table][index], error: null };
                                                    }
                                                }
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
                                if (mockStore[table]) {
                                    mockStore[table] = mockStore[table].filter((i: any) => i[column] !== value);
                                }
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
