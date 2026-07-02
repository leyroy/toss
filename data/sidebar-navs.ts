import {
  LayoutDashboardIcon,
  ChartBarIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  ShieldCheckIcon,
  TicketIcon,
} from "lucide-react"

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

export const sidebarNavs = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
      role: ["admin", "supervisor", "student"],
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: TicketIcon,
      role: ["admin", "supervisor", "student"],
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: UsersIcon,
      role: ["admin", "supervisor"],
    },
    {
      title: "Staffs",
      url: "/dashboard/staffs",
      icon: ShieldCheckIcon,
      role: ["admin"],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2Icon,
      role: ["admin", "supervisor", "student"],
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: CircleHelpIcon,
      role: ["admin", "supervisor", "student"],
    },
  ],
}
