"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  TrendingUpIcon,
  TicketIcon,
  ClockIcon,
  CheckCircle2Icon,
  UsersIcon,
} from "lucide-react"
import { getTicketsAction } from "@/actions/tickets"
import useAuthContext from "@/context/auth/useContext"

export function SectionCards() {
  const { user } = useAuthContext()
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  })

  const fetchStats = useCallback(async () => {
    const result = await getTicketsAction()
    if (result.success && result.tickets) {
      const tickets = result.tickets as { status: string }[]
      setStats({
        total: tickets.length,
        open: tickets.filter((t) => t.status === "OPEN").length,
        inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter(
          (t) => t.status === "RESOLVED" || t.status === "CLOSED"
        ).length,
      })
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const role = user?.role?.toLowerCase() || "student"

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tickets</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TicketIcon />
              All
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {role === "student"
              ? "Your submitted tickets"
              : "Platform-wide tickets"}
          </div>
          <div className="text-muted-foreground">
            Across all categories
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.open}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-500 border-blue-500/20">
              <UsersIcon />
              Awaiting
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Needs attention
          </div>
          <div className="text-muted-foreground">
            Not yet assigned or started
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.inProgress}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-500 border-amber-500/20">
              <ClockIcon />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently being handled
          </div>
          <div className="text-muted-foreground">
            Staff are working on these
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Resolved</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.resolved}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-500 border-green-500/20">
              <CheckCircle2Icon />
              Done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successfully closed{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Resolved or closed tickets</div>
        </CardFooter>
      </Card>
    </div>
  )
}
