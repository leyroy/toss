// actions/auth.ts
"use server"

import { User } from "@/context/auth/context"
import { API } from "@/lib/axios"
import { AxiosError, AxiosResponse } from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { da } from "zod/v4/locales"

interface LoginResponse extends AxiosResponse {
  data: {
    success: boolean
    message: string
    user: User
    error: string
  }
}

export async function loginAction(formData: Pick<User, "email" | "password">) {
  const email = formData.email
  const password = formData.password

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    })
    console.log("Login response:", response.data) // Log the entire response for debugging
    if (!response.data?.success) {
      throw new Error(response.data?.data.error || "Login failed")
    }

    const user = response.data?.user as User
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
    // ✅ Extract the actual error message from Axios instead of throwing
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
        status: error.response?.status,
      }
    }
    return { success: false, error: "Something went wrong" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}
