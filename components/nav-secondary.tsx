"use client"

import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconType } from "@/data/sidebar-navs"

export function NavSecondary({
  items,
  onSettingsClick,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: IconType
  }[]
  onSettingsClick?: () => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.title === "Settings" && onSettingsClick ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onSettingsClick()
                    }}
                    className="w-full text-left flex items-center gap-2 cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
