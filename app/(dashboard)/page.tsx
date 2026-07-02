"use client"

import { SectionCards } from "@/components/section-cards"
import useAuthContext from "@/context/auth/useContext"

export default function DashboardPage() {
  const { user } = useAuthContext()
  const role = user?.role?.toLowerCase() || "student"

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-xl font-semibold">
          Welcome back, {user?.fullName || "User"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {role === "admin"
            ? "Here's an overview of your helpdesk platform."
            : role === "supervisor"
              ? "Review assigned tickets and manage student requests."
              : "Track your support requests and submit new tickets."}
        </p>
      </div>
      <SectionCards />
    </div>
  )
}
