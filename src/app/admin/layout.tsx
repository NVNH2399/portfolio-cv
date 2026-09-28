"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Trang dang nhap khong can hien sidebar (nguoi dung chua duoc xac thuc)
  if (pathname === "/admin/login") {
    return <div data-theme="light">{children}</div>;
  }

  return (
    <div data-theme="light" className="flex h-dvh bg-paper-dim">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-white">
        <div className="border-b border-line px-5 py-5">
          <p className="font-display text-lg text-ink">Quản trị</p>
          <p className="text-xs text-muted">Portfolio &amp; CV</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNav />
        </div>

        <div className="space-y-1 border-t border-line px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-paper-dim"
          >
            <ArrowLeft size={16} className="text-muted" />
            Xem trang chủ
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
