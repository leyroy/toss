"use client"

import { useEffect, useState } from "react"
import { AuthContext, User } from "./context"
import { toast } from "sonner"
import { loginAction } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { API } from "@/lib/axios"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user data exists in localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const login = async (
    data: Pick<User, "email" | "password">
  ): Promise<void> => {
    setIsLoading(true)
    //fake asyc login
    try {
      const res = await loginAction(data)
      if (!res.user) throw new Error("Invalid credentials")
      setUser(res.user)
      localStorage.setItem("user", JSON.stringify(res.user))
      console.log("login user", res.user)
      // Redirect based on role
      router.push("/dashboard")
      toast.success("Login successful")
    } catch (error) {
      console.log("Login error:", error)
      toast.error((error as Error)?.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const res = await API.get("/auth/logout")
      if (!res.data?.success) throw new Error("Logout failed")
      setUser(null)
      localStorage.removeItem("user")
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.log("Logout error:", error)
      toast.error("Failed to log out")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user: user, login: login, logout: logout, isLoading: isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
