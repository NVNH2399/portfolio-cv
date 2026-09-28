"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-paper-dim"
    >
      <LogOut size={16} className="text-muted" />
      Đăng xuất
    </button>
  );
}
