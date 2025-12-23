import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();

    // Fetch future events, sorted by date
    const { data: events, error } = await supabase
        .from('events')
        .select('*');
    // .gte('date', new Date().toISOString()) // Filter past events
    // .order('date', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(events || []);
}

export async function POST(request: Request) {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const eventsToInsert = Array.isArray(body) ? body : [body];

        // Validation
        for (const event of eventsToInsert) {
            if (!event.title || !event.date || !event.type) {
                return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }
        }

        // Map to DB columns (ensure clean payload)
        const payload = eventsToInsert.map((event: any) => ({
            title: event.title,
            date: event.date,
            time: event.time,
            description: event.description,
            location: event.location,
            type: event.type,
            short_description: event.shortDescription,
            long_description: event.longDescription
        }));

        const { data, error } = await supabase
            .from('events')
            .insert(payload)
            .select();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('events')
            .update({
                title: body.title,
                date: body.date,
                time: body.time,
                description: body.description,
                location: body.location,
                type: body.type,
                short_description: body.shortDescription,
                long_description: body.longDescription
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
