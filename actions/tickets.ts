"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

// Helper to get active session user server side
async function getSessionUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null
  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export async function getTicketsAction() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" }
    }

    const { role, id: userId } = sessionUser

    let tickets
    if (role.toLowerCase() === "student") {
      // Students only see their own tickets
      tickets = await prisma.ticket.findMany({
        where: { createdById: userId },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (role.toLowerCase() === "supervisor") {
      // Supervisors see tickets assigned to them, or unassigned
      tickets = await prisma.ticket.findMany({
        where: {
          OR: [{ assignedToId: userId }, { assignedToId: null }],
        },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Admins see all tickets
      tickets = await prisma.ticket.findMany({
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return { success: true, tickets }
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return { success: false, error: "Failed to fetch tickets" }
  }
}

export async function createTicketAction(data: {
  title: string
  description: string
  priority: Priority
}) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" }
    }

    console.log(sessionUser)
    console.log({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "OPEN",
      createdById: sessionUser.id,
    })

    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "OPEN",
        createdById: sessionUser.id,
      },
    })

    revalidatePath("/dashboard/tickets")
    return { success: true, ticket }
  } catch (error) {
    console.error("Error creating ticket:", error)
    return { success: false, error: "Failed to create ticket" }
  }
}

export async function updateTicketStatusAction(
  id: string,
  status: TicketStatus
) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.role.toLowerCase() === "student") {
      return { success: false, error: "Unauthorized" }
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/dashboard/tickets")
    return { success: true, ticket }
  } catch (error) {
    console.error("Error updating ticket status:", error)
    return { success: false, error: "Failed to update ticket status" }
  }
}

export async function assignTicketAction(
  id: string,
  assignedToId: string | null
) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.role.toLowerCase() === "student") {
      return { success: false, error: "Unauthorized" }
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { assignedToId },
    })

    revalidatePath("/dashboard/tickets")
    return { success: true, ticket }
  } catch (error) {
    console.error("Error assigning ticket:", error)
    return { success: false, error: "Failed to assign ticket" }
  }
}

export async function addCommentAction(ticketId: string, body: string) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" }
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        ticketId,
        authorId: sessionUser.id,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    })

    revalidatePath("/dashboard/tickets")
    return { success: true, comment }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { success: false, error: "Failed to add comment" }
  }
}
