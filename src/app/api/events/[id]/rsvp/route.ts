import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const rsvpSchema = z.object({
  response: z.enum(["GOING", "NOT_GOING", "MAYBE"]),
  notes: z.string().optional(),
});

// POST or UPDATE RSVP
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = rsvpSchema.parse(body);

    // Upsert RSVP (create or update)
    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
      update: {
        response: validatedData.response,
        notes: validatedData.notes,
      },
      create: {
        userId: session.user.id,
        eventId: params.id,
        response: validatedData.response,
        notes: validatedData.notes,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "RSVP",
        entityType: "event",
        entityId: params.id,
        details: { response: validatedData.response },
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating RSVP:", error);
    return NextResponse.json(
      { error: "Failed to create RSVP" },
      { status: 500 }
    );
  }
}

// GET user's RSVP for this event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error("Error fetching RSVP:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP" },
      { status: 500 }
    );
  }
}
