'use client';

import { useEffect } from 'react';

/**
 * Emergency Cookie Scrubber
 * This component purely exists to fix the "Cookie Overflow" (494 Header Too Large) error
 * by cleaning up cookies from the CLIENT side before they hit the server.
 */
export function CookieScrubber() {
    useEffect(() => {
        // Run only once on mount
        try {
            const rawCookies = document.cookie.split(';');

            // If we have > 20 cookies, we assume something is wrong (the 165 cookie bug).
            // We initiate a nuclear cleanup.
            if (rawCookies.length > 20) {
                console.error(`[Cookie Scrubber] CRITICAL: Found ${rawCookies.length} cookies. Initiating cleanup.`);

                // 1. Delete every single cookie found
                rawCookies.forEach(cookie => {
                    const eqPos = cookie.indexOf('=');
                    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

                    if (name) {
                        // Attempt to delete for current path and root path
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${window.location.pathname};`;
                    }
                });

                // 2. Clear Local Storage and Session Storage for good measure
                localStorage.clear();
                sessionStorage.clear();

                console.warn('[Cookie Scrubber] Cleanup complete. Reloading page...');

                // 3. Force hard reload to apply changes and retry request cleanly
                window.location.reload();
            }
        } catch (e) {
            console.error('[Cookie Scrubber] Failed to run cleanup:', e);
        }
    }, []);

    return null; // Renders nothing
}
