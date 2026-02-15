"use client"

import * as React from "react"
import {
  Camera,
  ImageIcon,
  CircleDollarSign,
  FileStack,
  Contact,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
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

const data = {
  user: {
    name: "Iver",
    email: "iverlindholm@icloud.com",
    avatar: "/assets/logo-fotokirsti.png",
  },
  navMain: [
    {
      title: "Legg til bilder",
      url: "/admin",
      icon: Camera,
      isActive: true,
    },
    {
      title: "Alle bilder",
      url: "/admin/photos",
      icon: ImageIcon,
      isactive: true,
    },
    {
      title: "Prisliste",
      url: "/admin/pricelist",
      icon: CircleDollarSign,
      isactive: true,
    },
    {
      title: "Prislistehistorikk",
      url: "/admin/pricelist-history",
      icon: FileStack,
      isactive: true,
    },
    {
      title: "Kontakter",
      url: "/admin/contacts",
      icon: Contact,
      isactive: true,
    },
  ],
  navSecondary: [
  ],
  projects: [
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                    className="size-10 rounded-md border-2 border-gray-500"
                    src="/assets/logo-fotokirsti.png"
                    alt="Logo for Fotograf Kirsti Hovde"
                    width={32}
                    height={32}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-2xl">Fotokirsti</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
