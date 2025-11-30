import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');

    try {
        let query = supabase
            .from('rsvps')
            .select(`
        *,
        events (
          title,
          date
        )
      `)
            .order('created_at', { ascending: false });

        if (event_id) {
            query = query.eq('event_id', event_id);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
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

        const { error } = await supabase
            .from('rsvps')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'RSVP deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete RSVP' },
            { status: 500 }
        );
    }
}
