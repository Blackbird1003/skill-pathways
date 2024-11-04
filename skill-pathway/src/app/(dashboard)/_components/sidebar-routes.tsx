"use client";
import { Layout, Compass, BarChart, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const guestRoutes = [
  { icon: Layout, label: "Dashboard", href: "/" },
  { icon: Compass, label: "Search", href: "/search" },
];

const teacherRoutes = [
  { icon: BarChart, label: "Analytics", href: "/teacher/analytics" },
  { icon: List, label: "Courses", href: "/teacher/courses" },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col gap-x-4 w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
};
