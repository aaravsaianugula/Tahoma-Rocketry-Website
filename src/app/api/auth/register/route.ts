import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[@$!%*?&]/, "Password must contain special character"),
  gradeLevel: z.number().int().min(9).max(12).optional(),
  graduationYear: z.number().int().optional(),
  parentEmail: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        gradeLevel: validatedData.gradeLevel,
        graduationYear: validatedData.graduationYear,
        parentEmail: validatedData.parentEmail,
        role: "MEMBER",
        emailVerified: new Date(), // Auto-verify for now; add email verification later
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entityType: "user",
        entityId: user.id,
      },
    });

    // Don't return password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Registration successful",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
