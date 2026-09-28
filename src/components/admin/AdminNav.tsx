"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Sparkles,
  Award,
  Trophy,
  FileText,
} from "lucide-react";
import { RESOURCES } from "@/lib/resources";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Sparkles,
  certificates: Award,
  achievements: Trophy,
  documents: FileText,
};

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="flex flex-1 flex-col gap-1">
      <NavLink href="/admin" active={isActive("/admin")} icon={LayoutDashboard}>
        Tổng quan
      </NavLink>
      <NavLink href="/admin/sections" active={isActive("/admin/sections")} icon={LayoutTemplate}>
        Bố cục trang chủ
      </NavLink>

      <p className="mt-4 mb-1 px-3 text-xs font-medium uppercase tracking-wide text-muted">
        Nội dung
      </p>
      <NavLink href="/admin/profile" active={isActive("/admin/profile")} icon={User}>
        Thông tin cá nhân
      </NavLink>
      {Object.entries(RESOURCES).map(([key, config]) => (
        <NavLink
          key={key}
          href={`/admin/${key}`}
          active={isActive(`/admin/${key}`)}
          icon={ICONS[key] ?? FolderKanban}
        >
          {config.label}
        </NavLink>
      ))}
    </nav>
  );
}

function NavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
        active
          ? "bg-accent-soft font-medium text-accent"
          : "text-ink-soft hover:bg-paper-dim"
      }`}
    >
      <Icon size={16} className={active ? "text-accent" : "text-muted"} />
      {children}
    </Link>
  );
}
