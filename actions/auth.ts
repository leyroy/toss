// actions/auth.ts
"use server"

import { User } from "@/context/auth/context"
import { mockUsers } from "@/data/mockUsers"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(formData: Pick<User, "email" | "password">) {
  const email = formData.email
  const password = formData.password

  // Find user (later this becomes your API call)
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    return { error: "Invalid credentials" }
  }

  // Build a simple session payload
  const session = JSON.stringify({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  })

  // Set the cookie SERVER SIDE 🔥
  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return { success: true, user }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}
