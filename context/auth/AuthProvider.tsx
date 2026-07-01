"use client"

import { useState } from "react"
import { AuthContext, User } from "./context"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const login = async (): Promise<void> => {
    setUser(null)
  }
  const logout = async (): Promise<void> => {
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout }}>
      {children}
    </AuthContext.Provider>
  )
}
