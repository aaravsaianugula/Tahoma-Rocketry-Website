import { createBrowserClient } from '@supabase/ssr'

const MOCK_USER = {
    id: 'mock-user-id',
    email: 'pilot@tahomarocketry.org',
    user_metadata: { full_name: 'Mock Pilot' }
}

export function createClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase keys missing. Using Mock Client.')
        return {
            auth: {
                signInWithPassword: async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    return { data: { user: MOCK_USER }, error: null }
                },
                signUp: async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    return { data: { user: MOCK_USER }, error: null }
                },
                getUser: async () => {
                    return { data: { user: MOCK_USER }, error: null }
                },
                signOut: async () => {
                    return { error: null }
                }
            }
        } as any
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
