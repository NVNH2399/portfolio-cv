"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RESOURCES, FieldConfig } from "@/lib/resources";
import ImageUpload from "./ImageUpload";
import ProjectGallery from "./ProjectGallery";

export default function ResourceForm({
  resource,
  id, // undefined = tạo mới
}: {
  resource: string;
  id?: number;
}) {
  const router = useRouter();
  const config = RESOURCES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values, setValues] = useState<Record<string, any>>(id ? {} : { visible: true });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/${resource}/${id}`);
      const data = await res.json();
      setValues(toFormValues(config.fields, data));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, id]);

  if (!config) return null;

  function update(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = id ? `/api/${resource}/${id}` : `/api/${resource}`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (res.ok) {
      router.push(`/admin/${resource}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Có lỗi xảy ra");
    }
  }

  return (
    <div>
      <div className="border-b border-line pb-5">
        <button
          onClick={() => router.push(`/admin/${resource}`)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft size={14} />
          {config.label}
        </button>
        <h1 className="mt-2 font-display text-2xl text-ink">
          {id ? `Sửa ${config.label.toLowerCase()}` : `Thêm ${config.label.toLowerCase()}`}
        </h1>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Đang tải...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl">
          <div className="space-y-4 rounded-lg border border-line bg-white p-6">
            {config.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={(v) => update(field.key, v)}
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/admin/${resource}`)}
              className="rounded-md border border-line px-5 py-2 text-sm text-ink-soft hover:bg-paper-dim"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      {resource === "projects" && id && (
        <div className="mt-8 max-w-xl">
          <ProjectGallery projectId={id} />
        </div>
      )}
      {resource === "projects" && !id && !loading && (
        <p className="mt-6 max-w-xl text-sm text-muted">
          Lưu dự án trước, sau đó vào lại đây để thêm ảnh/video minh hoạ.
        </p>
      )}
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent";
const labelClass = "block text-sm font-medium text-ink-soft";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = (
    <span>
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </span>
  );

  if (field.type === "textarea" || field.type === "lines") {
    return (
      <label className={labelClass}>
        {label}
        {field.helpText && <p className="mt-0.5 text-xs text-muted">{field.helpText}</p>}
        <textarea
          rows={field.type === "lines" ? 4 : 3}
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <ImageUpload
        label={field.label}
        value={(value as string) ?? ""}
        onChange={onChange}
        accept="image/*,video/*"
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-line accent-accent"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={labelClass}>
        {label}
        <select
          className={inputClass}
          value={(value as string) ?? field.options?.[0]?.value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className={labelClass}>
      {label}
      {field.helpText && <p className="mt-0.5 text-xs text-muted">{field.helpText}</p>}
      <input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        className={inputClass}
        value={(value as string | number) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        step={field.type === "number" ? "any" : undefined}
      />
    </label>
  );
}

/** Chuyển data lấy từ API (đúng kiểu Prisma: Date, string[], boolean...) thành
 * giá trị hiển thị được trong input HTML (chủ yếu là string). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFormValues(fields: FieldConfig[], data: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const field of fields) {
    const raw = data[field.key];
    if (field.type === "tags" || field.type === "lines") {
      result[field.key] = Array.isArray(raw) ? raw.join(field.type === "tags" ? ", " : "\n") : "";
    } else if (field.type === "date" && raw) {
      result[field.key] = new Date(raw).toISOString().slice(0, 10);
    } else {
      result[field.key] = raw ?? "";
    }
  }
  return result;
}
