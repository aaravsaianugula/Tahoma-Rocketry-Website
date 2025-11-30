export type EventType = "launch" | "fundraiser" | "meeting";

export type Event = {
    id: string;
    title: string;
    date: string; // ISO string
    time?: string;
    location: string;
    type: EventType;
    shortDescription: string;
    longDescription?: string;
    isFeatured?: boolean;
    externalLink?: string;
};

export type LeadershipRole = "President" | "Vice President" | "Co-Treasurer" | "Secretary" | "Member";

export type Leader = {
    id: string;
    name: string;
    role: LeadershipRole;
    bio: string;
    imageUrl: string;
    imagePosition?: string;
};

export type GalleryCategory = "launch" | "build" | "meeting" | "fundraiser";

export type GalleryItem = {
    id: string;
    title: string;
    description: string;
    category: GalleryCategory;
    imageUrl: string;
    date?: string;
};

export type RSVPStatus = "going" | "maybe" | "not-going" | "not-responded";

export type RSVP = {
    id: string;
    eventId: string;
    studentName: string;
    studentEmail: string;
    status: RSVPStatus;
    createdAt: string;
};

export type UserRole = "student" | "admin";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
};
