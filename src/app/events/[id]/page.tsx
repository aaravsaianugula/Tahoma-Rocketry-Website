"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowLeft, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startTime: string;
  endTime: string | null;
  location: string | null;
  createdBy: {
    name: string;
  };
  rsvps: Array<{
    response: string;
    user: {
      name: string;
    };
  }>;
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [userRsvp, setUserRsvp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    if (session?.user) {
      fetchUserRsvp();
    }
  }, [params.id, session]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRsvp = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`);
      const data = await response.json();
      if (data && data.response) {
        setUserRsvp(data.response);
      }
    } catch (error) {
      console.error("Error fetching RSVP:", error);
    }
  };

  const handleRsvp = async (response: string) => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      await fetch(`/api/events/${params.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      setUserRsvp(response);
      fetchEvent(); // Refresh to update count
    } catch (error) {
      console.error("Error submitting RSVP:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await fetch(`/api/events/${params.id}`, { method: "DELETE" });
      router.push("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "OWNER";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-space-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const goingCount = event.rsvps.filter((r) => r.response === "GOING").length;
  const maybeCount = event.rsvps.filter((r) => r.response === "MAYBE").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/events">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </Link>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-space-blue to-space-electric pb-12">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-4 inline-block">
                  {event.eventType}
                </span>
                <CardTitle className="text-white text-4xl mt-2">
                  {event.title}
                </CardTitle>
              </div>
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Event Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-6 h-6 text-space-blue" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p>{formatDateTime(event.startTime)}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-6 h-6 text-space-blue" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-6 h-6 text-space-blue" />
                <div>
                  <p className="font-medium">Attendance</p>
                  <p>
                    {goingCount} going · {maybeCount} maybe
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">About this event</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* RSVP Section */}
            {session?.user ? (
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Your RSVP</h3>
                <div className="flex gap-3">
                  <Button
                    variant={userRsvp === "GOING" ? "default" : "outline"}
                    onClick={() => handleRsvp("GOING")}
                    className="flex-1"
                  >
                    Going
                  </Button>
                  <Button
                    variant={userRsvp === "MAYBE" ? "default" : "outline"}
                    onClick={() => handleRsvp("MAYBE")}
                    className="flex-1"
                  >
                    Maybe
                  </Button>
                  <Button
                    variant={userRsvp === "NOT_GOING" ? "default" : "outline"}
                    onClick={() => handleRsvp("NOT_GOING")}
                    className="flex-1"
                  >
                    Can&apos;t Go
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-t pt-6 text-center">
                <p className="text-gray-600 mb-4">Sign in to RSVP to this event</p>
                <Link href="/login">
                  <Button variant="gradient" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Attendees List (for admins) */}
            {isAdmin && event.rsvps.length > 0 && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-xl font-bold mb-4">Attendees ({goingCount})</h3>
                <div className="space-y-2">
                  {event.rsvps
                    .filter((rsvp) => rsvp.response === "GOING")
                    .map((rsvp, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-space-blue text-white flex items-center justify-center font-bold">
                          {rsvp.user.name[0]}
                        </div>
                        <span>{rsvp.user.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
