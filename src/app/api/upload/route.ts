import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Create a direct Supabase client for storage operations
// This bypasses cookie issues in API routes
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    // Use server client for auth check
    const supabase = await createServerClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'image'; // 'image' or 'video'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const allowedTypes = type === 'video' ? allowedVideoTypes : allowedImageTypes;

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
            }, { status: 400 });
        }

        // Validate file size (10MB for images, 100MB for videos)
        const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({
                error: `File too large. Max size: ${maxSize / 1024 / 1024}MB`
            }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${type}s/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Convert File to ArrayBuffer for Supabase upload
        const arrayBuffer = await file.arrayBuffer();

        // Upload to Supabase Storage using direct client
        const { data, error } = await supabaseAdmin.storage
            .from('gallery')
            .upload(filename, arrayBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Storage upload error:', error);
            return NextResponse.json({
                error: error.message || 'Storage upload failed'
            }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('gallery')
            .getPublicUrl(filename);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: data.path,
            message: 'File uploaded successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to upload file'
        }, { status: 500 });
    }
}
