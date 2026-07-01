"use client"

import { useState } from "react"
import { AuthContext, User } from "./context"
import { toast } from "sonner"
import { loginAction } from "@/actions/auth"
import { useRouter } from "next/navigation"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const login = async (
    data: Pick<User, "email" | "password">
  ): Promise<void> => {
    setIsLoading(true)
    //fake asyc login
    try {
      const user = await loginAction(data)
      if (!user.user) throw new Error("Invalid credentials")
      setUser(user.user)
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
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser(null)
      toast.success("Logged out successfully")
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
