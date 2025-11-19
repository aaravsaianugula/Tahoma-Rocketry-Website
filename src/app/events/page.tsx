"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, Plus } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

interface Event {
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
  _count: {
    rsvps: number;
  };
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const url = filter === "all"
        ? "/api/events"
        : `/api/events?type=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "OWNER";

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "MEETING", label: "Meetings" },
    { value: "LAUNCH", label: "Launches" },
    { value: "COMPETITION", label: "Competitions" },
    { value: "FUNDRAISER", label: "Fundraisers" },
    { value: "WORKSHOP", label: "Workshops" },
  ];

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      MEETING: "bg-blue-100 text-blue-800",
      LAUNCH: "bg-green-100 text-green-800",
      COMPETITION: "bg-purple-100 text-purple-800",
      FUNDRAISER: "bg-orange-100 text-orange-800",
      WORKSHOP: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-space-darkest mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our club activities, launches, and competitions
          </p>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === type.value
                    ? "bg-space-blue text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {isAdmin && (
            <Link href="/admin/events/create">
              <Button variant="gradient" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-space-blue border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No events found</p>
            <p className="text-gray-500 mt-2">Check back soon for upcoming events!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-space-blue to-space-electric">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-2xl">
                      {event.title}
                    </CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeColor(
                        event.eventType
                      )}`}
                    >
                      {event.eventType}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {event.description || "No description available"}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-space-blue" />
                      <span>{formatDateTime(event.startTime)}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-space-blue" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-space-blue" />
                      <span>{event._count.rsvps} attending</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/events/${event.id}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        View Details & RSVP
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
