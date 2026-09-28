"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { RESOURCES } from "@/lib/resources";

export default function ResourceTable({ resource }: { resource: string }) {
  const config = RESOURCES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/${resource}`);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  async function handleDelete(id: number) {
    if (!confirm("Xoá mục này? Không thể hoàn tác.")) return;
    await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
    load();
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleToggleVisible(item: any) {
    await fetch(`/api/${resource}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    load();
  }

  if (!config) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl text-ink">{config.label}</h1>
          <p className="mt-1 text-sm text-muted">{items.length} mục</p>
        </div>
        <Link
          href={`/admin/${resource}/new`}
          className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
        >
          <Plus size={16} />
          Thêm mới
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
        {loading ? (
          <p className="p-6 text-sm text-muted">Đang tải...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            Chưa có dữ liệu. Bấm &quot;Thêm mới&quot; ở trên để bắt đầu.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left">
                {config.listColumns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    {config.fields.find((f) => f.key === col)?.label ?? col}
                  </th>
                ))}
                <th className="w-32 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-line last:border-0 hover:bg-paper-dim/50 ${
                    item.visible === false ? "opacity-50" : ""
                  }`}
                >
                  {config.listColumns.map((col) => (
                    <td key={col} className="px-4 py-3 text-ink-soft">
                      {formatCell(item[col])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                                            <button
                        onClick={() => handleToggleVisible(item)}
                        className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim hover:text-accent"
                        title={item.visible === false ? "Đang ẩn — bấm để hiện" : "Đang hiện — bấm để ẩn"}
                      >
                        {item.visible === false ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        href={`/admin/${resource}/${item.id}`}
                        className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim hover:text-accent"
                        title="Sửa"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                        title="Xoá"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatCell(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return String(value ?? "");
}
