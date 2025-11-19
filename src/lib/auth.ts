import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
          const minutesLeft = Math.ceil(
            (user.accountLockedUntil.getTime() - new Date().getTime()) / 60000
          );
          throw new Error(
            `Account locked. Try again in ${minutesLeft} minutes.`
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          // Increment failed login attempts
          const failedAttempts = user.failedLoginAttempts + 1;
          const updates: any = { failedLoginAttempts: failedAttempts };

          // Lock account after 5 failed attempts for 30 minutes
          if (failedAttempts >= 5) {
            updates.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
          }

          await prisma.user.update({
            where: { id: user.id },
            data: updates,
          });

          throw new Error("Invalid credentials");
        }

        // Reset failed login attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            accountLockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        // Create audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entityType: "user",
            entityId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhotoUrl: user.profilePhotoUrl,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.profilePhotoUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
