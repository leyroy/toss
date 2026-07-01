// actions/auth.ts
"use server"

import { User } from "@/context/auth/context"
import { API } from "@/lib/axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(formData: Pick<User, "email" | "password">) {
  const email = formData.email
  const password = formData.password

  try {
    const response = await API.post("/auth/login", { email, password })
    if (!response.data.success) {
      throw new Error(response.data.error || "Login failed")
    }

    const user = response.data.user as User
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
  } catch (error) {
    // console.error("Error during login:", error)
    throw error
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}
