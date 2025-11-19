import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create OWNER account (Aarav - you!)
  const ownerPassword = await bcrypt.hash("TahomaRocketry2024!", 12);

  const owner = await prisma.user.upsert({
    where: { email: "aarav@tahomarocketry.club" },
    update: {},
    create: {
      email: "aarav@tahomarocketry.club",
      name: "Aarav Sai Anugula",
      passwordHash: ownerPassword,
      role: "OWNER",
      emailVerified: new Date(),
      gradeLevel: 11, // Adjust as needed
      profilePhotoUrl: "/assets/leadership/aarav-sai-anugula.jpg",
    },
  });

  console.log(`✅ Created OWNER account: ${owner.email}`);
  console.log(`   Password: TahomaRocketry2024!`);
  console.log(`   (Change this password immediately after first login!)`);

  // Create demo admin account (for testing)
  const adminPassword = await bcrypt.hash("Admin2024!Demo", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tahomarocketry.club" },
    update: {},
    create: {
      email: "admin@tahomarocketry.club",
      name: "Demo Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created ADMIN account: ${admin.email}`);
  console.log(`   Password: Admin2024!Demo`);

  // Create demo member account (for testing)
  const memberPassword = await bcrypt.hash("Member2024!Test", 12);

  const member = await prisma.user.upsert({
    where: { email: "member@tahomarocketry.club" },
    update: {},
    create: {
      email: "member@tahomarocketry.club",
      name: "Test Member",
      passwordHash: memberPassword,
      role: "MEMBER",
      emailVerified: new Date(),
      gradeLevel: 10,
      graduationYear: 2026,
    },
  });

  console.log(`✅ Created MEMBER account: ${member.email}`);
  console.log(`   Password: Member2024!Test`);

  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: "MOD Pizza Fundraiser",
      description:
        "Join us in supporting Tahoma Rocketry Club at MOD Pizza in Maple Valley. Your contribution helps fund rocket motors, competition travel, and materials for club projects.",
      eventType: "FUNDRAISER",
      startTime: new Date("2025-11-21T00:00:00"),
      endTime: new Date("2025-11-21T23:59:59"),
      location: "MOD Pizza, Maple Valley",
      status: "PUBLISHED",
      createdById: owner.id,
    },
  });

  console.log(`✅ Created sample event: ${event.title}`);

  // Create weekly meeting events
  const meeting = await prisma.event.create({
    data: {
      title: "Weekly Club Meeting",
      description:
        "Join us every Tuesday during Power Hour A for club meetings, rocket building, and project discussions.",
      eventType: "MEETING",
      startTime: new Date("2025-11-25T13:00:00"),
      endTime: new Date("2025-11-25T14:00:00"),
      location: "Tahoma High School",
      recurringPattern: "weekly",
      status: "PUBLISHED",
      createdById: owner.id,
    },
  });

  console.log(`✅ Created recurring event: ${meeting.title}`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("┌─────────────────────────────────────────────────────┐");
  console.log("│ YOUR OWNER ACCOUNT:                                 │");
  console.log("│ Email: aarav@tahomarocketry.club                    │");
  console.log("│ Password: TahomaRocketry2024!                       │");
  console.log("│                                                     │");
  console.log("│ ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!              │");
  console.log("└─────────────────────────────────────────────────────┘");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
