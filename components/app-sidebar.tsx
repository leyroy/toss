"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LifeBuoyIcon } from "lucide-react"
import { sidebarNavs as data } from "@/data/sidebar-navs"
import useAuthContext from "@/context/auth/useContext"
import Link from "next/link"

export function AppSidebar({
  onSettingsClick,
  ...props
}: React.ComponentProps<typeof Sidebar> & { onSettingsClick?: () => void }) {
  const { user } = useAuthContext()

  // Normalize role to lowercase for comparison with sidebar nav role arrays
  const userRole = user?.role?.toLowerCase() || ""

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <LifeBuoyIcon className="size-5!" />
                <span className="text-base font-semibold">HelpBridge</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.filter((item) =>
            item.role?.includes(userRole)
          )}
        />
        <NavSecondary
          items={data.navSecondary.filter((item) =>
            item.role?.includes(userRole)
          )}
          onSettingsClick={onSettingsClick}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
