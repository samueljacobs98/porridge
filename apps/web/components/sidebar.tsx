"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@frontend/ui/components/sidebar";
import {
  IconBriefcase,
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
} from "@tabler/icons-react";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar className="relative">
      <SidebarHeader>
        <SidebarMenuButton
          className="mx-auto w-fit gap-2 rounded-full font-semibold"
          onClick={toggleSidebar}
          render={<IconLayoutSidebar />}
        />
      </SidebarHeader>
      <SidebarHeader className="absolute top-0 right-0 flex h-fit w-(--sidebar-width) translate-x-full group-data-[state=expanded]:hidden">
        <SidebarMenuButton
          className="mx-auto w-fit flex-row items-center justify-center rounded-full"
          onClick={toggleSidebar}
        >
          <IconLayoutSidebarFilled />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={true}
                  size="sm"
                  render={
                    <Link href="/">
                      <IconBriefcase />
                      Sessions
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
