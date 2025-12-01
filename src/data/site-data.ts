import { Event, Leader, GalleryItem, User } from '@/lib/types';

export const siteConfig = {
    name: "Tahoma Rocketry Club",
    description: "Inspire, Build, Launch. The official website of the Tahoma Rocketry Club.",
    contact: {
        email: "Thsrocketryclub@gmail.com",
        phone: "206-973-6876",
        address: "23499 SE Tahoma Way, Maple Valley, WA 98038, USA",
    },
    links: {
        instagram: "#",
        discord: "#",
    },
};

export const NAV_ITEMS = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Leadership", href: "/leadership" },
    { name: "Contact", href: "/contact" },
];

export const HERO_CONTENT = {
    badge: "Recruiting New Members",
    title: {
        line1: "INSPIRE",
        line2: "BUILD",
        line3: "LAUNCH",
    },
    description: "Tahoma Rocketry Club is designing the future of student aerospace. Join us every Tuesday to send your ideas skyward.",
    videoUrl: "/assets/Videos/Tahoma highschool overhead shot.mp4",
};

export const MISSION_CARD_CONTENT = {
    status: "MISSION STATUS: GO",
    nextMissionTitle: "Next Mission",
    nextMissionSubtitle: "Don't miss our next launch event.",
};

export const ABOUT_CONTENT = {
    title: "About TRC",
    description: "The Tahoma Rocketry Club is a student-led organization at Tahoma High School dedicated to making aerospace accessible to everyone. We design, build, and launch model rockets, providing members with real-world engineering experience.",
    stats: [
        { value: "Every Tue", label: "Meetings during Power Hour A", color: "text-[#D4AF37]" },
        { value: "2", label: "Successful Launches", color: "text-white" },
        { value: "NAR", label: "Safety Standards Followed", color: "text-[#DC2626]" },
    ],
    mission: {
        title: "Our Mission",
        description: "Our mission is to spark curiosity and foster creativity through the lens of aerospace engineering. We believe that the best way to learn is by doing—getting our hands dirty with carbon fiber, epoxy, and electronics.",
        points: [
            "Accessibility for all skill levels",
            "Strict adherence to NAR safety codes",
            "Collaboration over competition",
            "Real-world project management skills"
        ]
    }
};

export const EVENTS: Event[] = [
    {
        id: "evt-1",
        title: "Model Rocket Launch",
        date: "2025-11-19T09:00:00",
        time: "9:00 AM - 12:00 PM",
        location: "60 Acres Park, Redmond",
        type: "launch",
        shortDescription: "Our monthly model rocket launch event. Open to all members.",
        longDescription: "Join us for a morning of high-flying action! We'll be launching model rockets. Spectators are welcome. Please bring your own water and chairs.",
        isFeatured: true,
    },
    {
        id: "evt-2",
        title: "MOD Pizza Fundraiser",
        date: "2025-11-21T11:00:00",
        time: "11:00 AM - 9:00 PM",
        location: "MOD Pizza, Maple Valley",
        type: "fundraiser",
        shortDescription: "Support TRC by grabbing a slice! 20% of proceeds go to the club.",
        externalLink: "https://modpizza.com",
        isFeatured: true,
    },
    {
        id: "evt-3",
        title: "Weekly Club Meeting",
        date: "2025-11-25T14:30:00",
        time: "2:30 PM - 3:30 PM",
        location: "Tahoma High School, Room 119",
        type: "meeting",
        shortDescription: "Regular club meeting during Power Hour A.",
        longDescription: "We will be discussing upcoming launches and distributing new engine kits.",
    },
];

export const LEADERSHIP: Leader[] = [
    {
        id: "ldr-1",
        name: "Samrinder Dhaliwal",
        role: "President",
        bio: "Leading the club with a passion for aerospace engineering and propulsion systems. Samrinder oversees all club operations.",
        imageUrl: "/assets/LeaderShip photos/Samrindar diwali.jpeg",
        imagePosition: "object-center",
    },
    {
        id: "ldr-2",
        name: "AaravSai Anugula",
        role: "Vice President",
        bio: "Dedicated to ensuring smooth mission operations and technical safety. AaravSai manages launch logistics.",
        imageUrl: "/assets/LeaderShip photos/Aaravsai anugula.jpg",
        imagePosition: "object-top",
    },
    {
        id: "ldr-3",
        name: "Sos Peter",
        role: "Co-Treasurer",
        bio: "Managing the club's finances and fundraising initiatives to keep our rockets fueled and flying.",
        imageUrl: "/assets/LeaderShip photos/Sos Peter.jpg",
        imagePosition: "object-top",
    },
    {
        id: "ldr-4",
        name: "Zaylie Russmen",
        role: "Co-Treasurer",
        bio: "Coordinating budget allocation for new projects and ensuring we have the resources to reach new heights.",
        imageUrl: "/assets/LeaderShip photos/Zaliy russman.png",
        imagePosition: "object-top",
    },
];

export const GALLERY: GalleryItem[] = [
    {
        id: "gal-1",
        title: "Model Rocket Launch",
        description: "A successful test flight of the 'Icarus' prototype.",
        category: "launch",
        imageUrl: "/assets/project-tarc.jpg",
        date: "2025-10-15",
    },
    {
        id: "gal-2",
        title: "Rocket Build",
        description: "Members applying final fillets to their rockets.",
        category: "build",
        imageUrl: "/assets/project-l1.jpg",
        date: "2025-10-20",
    },
    {
        id: "gal-3",
        title: "Avionics Workshop",
        description: "Programming altimeters for dual-deployment recovery.",
        category: "meeting",
        imageUrl: "/assets/project-avionics.jpg",
        date: "2025-11-05",
    },
];

export const MOCK_USER: User = {
    id: "usr-1",
    name: "Student Member",
    email: "student@tahomasd.us",
    role: "student", // Change to 'admin' to test admin view
    avatarUrl: "/assets/team-alex.jpg",
};
