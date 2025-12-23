import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // Reverting to standard Supabase auth behavior.
    // Removed all custom cookie cleanup logic to resolve login/redirect loops.
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * strict matcher to prevent cookie explosion on unrelated routes
         */
        '/dashboard/:path*',
        '/login',
        '/signup',
        '/api/auth/:path*' // Only run on auth-specific APIs if any
    ],
}
