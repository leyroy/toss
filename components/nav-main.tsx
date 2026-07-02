"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconType } from "@/data/sidebar-navs"
import { cn } from "@/lib/utils"
import { CirclePlusIcon } from "lucide-react"
import { usePathname } from "next/dist/client/components/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconType
  }[]
}) {
  // Get the current pathname using the usePathname hook
  const pathName = usePathname()
  const isActive = (url: string) => {
    return pathName.split("/")[1] === url.toLocaleLowerCase()
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className={cn(
                "min-w-8 text-primary-foreground duration-200 ease-linear hover:text-primary-foreground",
                isActive("/create") &&
                  "text-primary-foreground hover:bg-primary/90 active:bg-primary/90"
              )}
            >
              <CirclePlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={cn(
                  isActive(item.url) && "bg-primary text-primary-foreground"
                )}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
