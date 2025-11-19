"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Image, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-space-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
    router.push("/login");
    return null;
  }

  const isOwner = session.user.role === "OWNER";

  const adminActions = [
    {
      title: "Manage Events",
      description: "Create, edit, and delete club events",
      icon: Calendar,
      href: "/events",
      action: "View Events",
    },
    {
      title: "Create Event",
      description: "Add a new event to the calendar",
      icon: Calendar,
      href: "/admin/events/create",
      action: "Create",
      highlight: true,
    },
    {
      title: "Gallery Management",
      description: "Upload photos and videos",
      icon: Image,
      href: "/admin/gallery",
      action: "Manage Gallery",
    },
    ...(isOwner
      ? [
          {
            title: "User Management",
            description: "Manage users and promote admins",
            icon: Users,
            href: "/admin/users",
            action: "Manage Users",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-space-darkest mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {session.user.name}!{" "}
            <span className="text-space-blue font-semibold">
              {session.user.role}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className={`hover:shadow-xl transition-all duration-300 ${
                  action.highlight ? "border-2 border-space-blue" : ""
                }`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-full ${
                      action.highlight ? "gradient-primary" : "bg-gray-100"
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        action.highlight ? "text-white" : "text-space-blue"
                      }`}
                    />
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <Link href={action.href}>
                    <Button
                      variant={action.highlight ? "gradient" : "outline"}
                      className="w-full"
                    >
                      {action.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-space-blue">-</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-space-blue">-</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-space-blue">-</div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-space-blue">-</div>
                <div className="text-sm text-gray-600">RSVPs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
