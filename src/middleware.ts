import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN" || token?.role === "OWNER";
    const isOwner = token?.role === "OWNER";
    const pathname = req.nextUrl.pathname;

    // Protect admin routes
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect owner-only routes
    if (pathname.startsWith("/admin/users/manage-admins") && !isOwner) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Protect member routes
    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/about") ||
          pathname.startsWith("/contact")
        ) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/events/:path*",
    "/gallery/:path*",
  ],
};
