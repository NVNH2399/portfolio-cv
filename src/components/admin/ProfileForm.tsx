"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@prisma/client";
import ImageUpload from "./ImageUpload";

export default function ProfileForm({ initial }: { initial: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    titleVi: initial?.titleVi ?? "",
    titleEn: initial?.titleEn ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    location: initial?.location ?? "",
    github: initial?.github ?? "",
    linkedin: initial?.linkedin ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    summaryVi: initial?.summaryVi ?? "",
    summaryEn: initial?.summaryEn ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      setMessage("Đã lưu.");
      router.refresh();
    } else {
      setMessage("Có lỗi khi lưu, thử lại nhé.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="space-y-5 rounded-lg border border-line bg-white p-6">
        <Section title="Thông tin chung">
          <Row label="Họ tên">
            <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Row>
          <div className="grid grid-cols-2 gap-4">
            <Row label="Chức danh (VI)">
              <input className={inputClass} value={form.titleVi} onChange={(e) => update("titleVi", e.target.value)} />
            </Row>
            <Row label="Chức danh (EN)">
              <input className={inputClass} value={form.titleEn} onChange={(e) => update("titleEn", e.target.value)} />
            </Row>
          </div>
        </Section>

        <Section title="Liên hệ">
          <div className="grid grid-cols-2 gap-4">
            <Row label="Email">
              <input className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
            </Row>
            <Row label="Điện thoại">
              <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Row>
          </div>
          <Row label="Địa điểm">
            <input className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
          </Row>
          <div className="grid grid-cols-2 gap-4">
            <Row label="GitHub URL">
              <input className={inputClass} value={form.github} onChange={(e) => update("github", e.target.value)} />
            </Row>
            <Row label="LinkedIn URL">
              <input className={inputClass} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
            </Row>
          </div>
          <ImageUpload
            label="Ảnh đại diện"
            value={form.avatarUrl}
            onChange={(url) => update("avatarUrl", url)}
            accept="image/*"
            aspect="square"
          />
        </Section>

        <Section title="Tóm tắt">
          <Row label="Tóm tắt (VI)">
            <textarea
              rows={4}
              className={inputClass}
              value={form.summaryVi}
              onChange={(e) => update("summaryVi", e.target.value)}
            />
          </Row>
          <Row label="Tóm tắt (EN)">
            <textarea
              rows={4}
              className={inputClass}
              value={form.summaryEn}
              onChange={(e) => update("summaryEn", e.target.value)}
            />
          </Row>
        </Section>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {message && <span className="text-sm text-muted">{message}</span>}
      </div>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink-soft">
      {label}
      {children}
    </label>
  );
}
