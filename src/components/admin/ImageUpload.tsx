"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({
  value,
  onChange,
  accept = "image/*",
  label,
  aspect = "video", // "video" (16:9) | "square"
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  aspect?: "video" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isVideo = value && /\.(mp4|webm|mov)(\?|$)/i.test(value);

  async function upload(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-ink-soft">{label}</p>}

      {value ? (
        <div className="relative w-full overflow-hidden rounded-md border border-line bg-paper-dim">
          {isVideo ? (
            <video src={value} className="h-40 w-full object-cover" controls muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-40 w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-ink/70 p-1.5 text-paper hover:bg-ink"
            title="Xoá ảnh"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center ${
            dragging ? "border-accent bg-accent-soft" : "border-line bg-paper-dim hover:border-accent"
          } ${aspect === "video" ? "h-40" : "h-32 w-32"}`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin text-muted" />
              <p className="text-xs text-muted">Đang tải lên...</p>
            </>
          ) : (
            <>
              <Upload size={20} className="text-muted" />
              <p className="text-xs text-muted">Kéo thả hoặc bấm để chọn file</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
