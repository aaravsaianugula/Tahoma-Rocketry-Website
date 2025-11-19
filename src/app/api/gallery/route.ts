import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all photos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "APPROVED";
    const album = searchParams.get("album");

    const where: any = { status };
    if (album) {
      where.album = album;
    }

    const photos = await prisma.photo.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST upload photo (admin only for now)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, only admins can upload
    if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only admins can upload photos" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description,
        photoUrl: body.photoUrl,
        album: body.album,
        status: "APPROVED", // Auto-approve admin uploads
        approvedById: session.user.id,
        approvedAt: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPLOAD_PHOTO",
        entityType: "photo",
        entityId: photo.id,
        details: { title: photo.title },
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
