"use client"
import { createContext } from "react"

const UserRole = {
  Admin: "Admin",
  Student: "student",
  Advisor: "advisor",
} as const

type UserRole = (typeof UserRole)[keyof typeof UserRole]
export type User = {
  id: number
  fullName: string
  email: string
  password: string | null
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (user: Pick<User, "email" | "password">) => void
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
})
