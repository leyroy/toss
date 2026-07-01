import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

async function main() {
  console.log("🌱 Seeding database...")

  // ── Clean existing data ──────────────────────────────
  await prisma.comment.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // ── Hash password ────────────────────────────────────
  const password = await bcrypt.hash("password123", 10)

  // ── Users ────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Ley Roy",
      email: "admin@helpbridge.com",
      password,
      role: "ADMIN",
    },
  })

  const staff = await prisma.user.create({
    data: {
      name: "Kofi Mensah",
      email: "staff@helpbridge.com",
      password,
      role: "SUPERVISOR",
    },
  })

  const student1 = await prisma.user.create({
    data: {
      name: "Abena Serwaa",
      email: "abena@helpbridge.com",
      password,
      role: "STUDENT",
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: "Kwame Asante",
      email: "kwame@helpbridge.com",
      password,
      role: "STUDENT",
    },
  })

  console.log("✅ Users created")

  // ── Tickets ──────────────────────────────────────────
  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Cannot access student portal",
      description:
        "I keep getting a 403 error when trying to log into the student portal.",
      status: "OPEN",
      priority: "HIGH",
      createdById: student1.id,
      assignedToId: staff.id,
    },
  })

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Email not receiving OTP",
      description:
        "I registered but I never received the OTP to verify my email.",
      status: "IN_PROGRESS",
      priority: "URGENT",
      createdById: student2.id,
      assignedToId: staff.id,
    },
  })

  const ticket3 = await prisma.ticket.create({
    data: {
      title: "Request to reset password",
      description: "I forgot my password and the reset link is not working.",
      status: "RESOLVED",
      priority: "MEDIUM",
      createdById: student1.id,
      assignedToId: staff.id,
    },
  })

  const ticket4 = await prisma.ticket.create({
    data: {
      title: "Wrong course registered",
      description:
        "I was registered for the wrong course. Please help me fix this.",
      status: "OPEN",
      priority: "LOW",
      createdById: student2.id,
    },
  })

  console.log("✅ Tickets created")

  // ── Comments ─────────────────────────────────────────
  await prisma.comment.createMany({
    data: [
      {
        body: "We are looking into this issue, please give us 24 hours.",
        ticketId: ticket1.id,
        authorId: staff.id,
      },
      {
        body: "Thank you, I will wait.",
        ticketId: ticket1.id,
        authorId: student1.id,
      },
      {
        body: "Your OTP has been resent, please check spam as well.",
        ticketId: ticket2.id,
        authorId: staff.id,
      },
      {
        body: "Password has been reset successfully. Please login with the temporary password: Helpdesk@123",
        ticketId: ticket3.id,
        authorId: staff.id,
      },
      {
        body: "Thank you so much, it worked!",
        ticketId: ticket3.id,
        authorId: student1.id,
      },
    ],
  })

  console.log("✅ Comments created")
  console.log("🎉 Seeding complete!")
  console.log("")
  console.log("Test accounts:")
  console.log("  Admin   → admin@helpbridge.com  / password123")
  console.log("  Staff   → staff@helpbridge.com  / password123")
  console.log("  Student → abena@helpbridge.com  / password123")
  console.log("  Student → kwame@helpbridge.com  / password123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
