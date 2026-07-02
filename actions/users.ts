"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type UserRole = "ADMIN" | "SUPERVISOR" | "STUDENT"

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: UserRole
  phoneNumber?: string
  department?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  phoneNumber?: string
  department?: string
}

export async function getUsersAction(role?: UserRole) {
  try {
    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tickets: true,
            assigned: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function createUserAction(data: CreateUserData) {
  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return { success: false, error: "A user with this email already exists" }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phoneNumber: data.phoneNumber || null,
        department: data.department || null,
      },
    })

    revalidatePath("/dashboard/students")
    revalidatePath("/dashboard/staffs")

    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUserAction(id: string, data: UpdateUserData) {
  try {
    const updateData: Record<string, unknown> = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber
    if (data.department !== undefined) updateData.department = data.department
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/dashboard/students")
    revalidatePath("/dashboard/staffs")

    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUserAction(id: string) {
  try {
    // Delete related comments and tickets first
    await prisma.comment.deleteMany({ where: { authorId: id } })
    await prisma.comment.deleteMany({
      where: { ticket: { createdById: id } },
    })
    await prisma.ticket.deleteMany({ where: { createdById: id } })

    // Unassign from tickets
    await prisma.ticket.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    })

    await prisma.user.delete({ where: { id } })

    revalidatePath("/dashboard/students")
    revalidatePath("/dashboard/staffs")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function changePasswordAction(data: {
  currentPassword?: string
  newPassword?: string
}) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }
    const sessionUser = JSON.parse(session)

    if (!data.currentPassword || !data.newPassword) {
      return { success: false, error: "All password fields are required" }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    })

    if (!dbUser) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    const isMatch = bcrypt.compareSync(data.currentPassword, dbUser.password)
    if (!isMatch) {
      return { success: false, error: "Incorrect current password" }
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10)
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "Failed to change password" }
  }
}
