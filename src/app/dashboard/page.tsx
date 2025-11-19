"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Settings } from "lucide-react";

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-space-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  // Redirect admins to admin dashboard
  if (session.user.role === "ADMIN" || session.user.role === "OWNER") {
    router.push("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-space-darkest mb-4">
            My Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {session.user.name}!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View and manage your event RSVPs
              </p>
              <Link href="/events">
                <Button variant="gradient" className="w-full">
                  View Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-space-blue" />
              </div>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Role:</span>
                  <p className="font-medium">{session.user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>My Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              No upcoming events. <Link href="/events" className="text-space-blue hover:underline">Browse events</Link> to RSVP!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
