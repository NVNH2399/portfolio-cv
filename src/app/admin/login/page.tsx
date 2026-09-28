"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Đăng nhập thất bại");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-paper-dim px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-line bg-white p-8"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink">
            <LockKeyhole size={16} className="text-paper" />
          </div>
          <div>
            <p className="font-display text-lg text-ink leading-none">Đăng nhập</p>
            <p className="text-xs text-muted">Khu vực quản trị</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Tài khoản</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
