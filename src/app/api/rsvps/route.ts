import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId') || searchParams.get('event_id');

    try {
        let query = supabase
            .from('rsvps')
            .select('*')
            .order('created_at', { ascending: false });

        if (eventId) {
            query = query.eq('event_id', eventId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Get RSVPs error:', error?.message);
        return NextResponse.json(
            { error: 'Failed to fetch RSVPs' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { error: 'RSVP ID is required' },
            { status: 400 }
        );
    }

    try {
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete RSVP - user can only delete their own RSVPs (by email)
        const { error } = await supabase
            .from('rsvps')
            .delete()
            .eq('id', id)
            .eq('email', user.email); // Security: only delete own RSVPs

        if (error) throw error;

        return NextResponse.json({ message: 'RSVP deleted successfully' });
    } catch (error: any) {
        console.error('Delete RSVP error:', error?.message);
        return NextResponse.json(
            { error: 'Failed to delete RSVP' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { event_id, guests = 0 } = body;

        if (!event_id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        // Check if already RSVP'd using email
        const { data: existingRSVP } = await supabase
            .from('rsvps')
            .select('id')
            .eq('event_id', event_id)
            .eq('email', user.email)
            .single();

        if (existingRSVP) {
            return NextResponse.json(
                { error: 'You have already RSVP\'d to this event', id: existingRSVP.id },
                { status: 400 }
            );
        }

        // Get user's display name
        const userName = user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Anonymous';

        // Insert RSVP with correct column names matching Supabase schema:
        // id (uuid), name (text), email (text), guests (int4), event_id (uuid), created_at (timestamptz)
        const { data, error } = await supabase
            .from('rsvps')
            .insert({
                event_id,
                email: user.email,
                name: userName,
                guests: guests
            })
            .select()
            .single();

        if (error) {
            console.error('RSVP Insert Error:', error);
            throw error;
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('RSVP Error:', error);
        console.error('RSVP Error message:', error?.message);
        return NextResponse.json(
            { error: 'Failed to create RSVP', details: error?.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
