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
      url: "/tickets",
      icon: TicketIcon,
      role: ["admin", "supervisor", "student"],
    },
    {
      title: "Students",
      url: "/students",
      icon: UsersIcon,
      role: ["admin", "supervisor"],
    },
    {
      title: "Staffs",
      url: "/staffs",
      icon: ShieldCheckIcon,
      role: ["admin"],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2Icon,
      role: ["admin", "supervisor", "student"],
    },
    {
      title: "Get Help",
      url: "/help",
      icon: CircleHelpIcon,
      role: ["admin", "supervisor", "student"],
    },
  ],
}
