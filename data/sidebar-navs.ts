import {
  LayoutDashboardIcon,
  ChartBarIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
} from "lucide-react"

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

export const sidebarNavs = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboardIcon,
      role: ["admin"],
    },
    {
      title: "Reports",
      url: "reports",
      icon: ChartBarIcon,
      role: ["admin", "advisor", "student"],
    },
    {
      title: "Students",
      url: "students",
      icon: UsersIcon,
      role: ["admin", "advisor"],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "settings",
      icon: Settings2Icon,
      role: ["admin", "advisor", "student"],
    },
    {
      title: "Get Help",
      url: "help",
      icon: CircleHelpIcon,
    },
  ],
}
