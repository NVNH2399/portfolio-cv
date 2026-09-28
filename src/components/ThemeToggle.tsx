"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Gia tri that su da duoc script inline trong layout.tsx set truoc do,
  // o day chi doc lai de icon hien thi dung ngay lan render dau tien.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Chuyển giao diện sáng/tối"
      className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim hover:text-accent"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
