"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ImageUpload from "./ImageUpload";

type MediaItem = { id: number; url: string; type: string };

export default function ProjectGallery({ projectId }: { projectId: number }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/projects/${projectId}/media`);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleAdd(url: string) {
    const type = /\.(mp4|webm|mov)(\?|$)/i.test(url) ? "video" : "image";
    await fetch(`/api/projects/${projectId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, type }),
    });
    load();
  }

  async function handleRemove(mediaId: number) {
    await fetch(`/api/projects/${projectId}/media/${mediaId}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <p className="text-sm font-medium text-ink">Ảnh / video minh hoạ dự án</p>
      <p className="mt-0.5 text-xs text-muted">
        Hiển thị trong trang dự án ở portfolio. Thêm bao nhiêu ảnh/video cũng được.
      </p>

      {!loading && items.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-md border border-line">
              {item.type === "video" ? (
                <video src={item.url} className="h-24 w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-24 w-full object-cover" />
              )}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 p-1 text-paper hover:bg-ink"
                title="Xoá"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <ImageUpload value="" onChange={handleAdd} accept="image/*,video/*" />
      </div>
    </div>
  );
}
