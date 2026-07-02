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
import { CommandIcon } from "lucide-react"
import { sidebarNavs as data } from "@/data/sidebar-navs"
import useAuthContext from "@/context/auth/useContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()
  console.log("login user", user)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.filter((item) =>
            item.role?.includes(user?.role?.toLocaleLowerCase() || "")
          )}
        />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary
          items={data.navSecondary.filter((item) =>
            item.role?.includes(user?.role?.toLocaleLowerCase() || "")
          )}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        {" "}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
