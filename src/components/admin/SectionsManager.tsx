"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import type { HomeSection } from "@prisma/client";

export default function SectionsManager({ initial }: { initial: HomeSection[] }) {
  const router = useRouter();
  const [items, setItems] = useState(
    [...initial].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }

  function toggleVisible(index: number) {
    const next = [...items];
    next[index] = { ...next[index], visible: !next[index].visible };
    setItems(next);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const payload = items.map((item, i) => ({
      id: item.id,
      order: i + 1,
      visible: item.visible,
    }));

    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    <div className="max-w-xl">
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 ${
              item.visible ? "" : "opacity-50"
            }`}
          >
            <span className="w-5 text-sm text-muted">{i + 1}</span>
            <span className="flex-1 text-sm font-medium text-ink">{item.labelVi}</span>

            <button
              type="button"
              onClick={() => toggleVisible(i)}
              className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper-dim"
              title={item.visible ? "Đang hiện — bấm để ẩn" : "Đang ẩn — bấm để hiện"}
            >
              {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              {item.visible ? "Hiện" : "Ẩn"}
            </button>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim disabled:opacity-30"
                title="Đưa lên trên"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim disabled:opacity-30"
                title="Đưa xuống dưới"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        Phần &quot;Dự án&quot; nếu ẩn sẽ ẩn toàn bộ khối dự án khỏi trang chủ (từng dự án lẻ
        vẫn quản lý số lượng/nội dung ở mục Dự án như bình thường).
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {message && <span className="text-sm text-muted">{message}</span>}
      </div>
    </div>
  );
}
