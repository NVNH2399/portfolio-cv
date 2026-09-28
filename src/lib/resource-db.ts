import { prisma } from "./prisma";
import { getResourceConfig, FieldConfig } from "./resources";

// Map tên resource trên URL (vd "skills") sang đúng delegate Prisma
// (vd prisma.skillGroup). any ở đây là đánh đổi hợp lý cho 1 lớp generic
// CRUD dùng chung cho nhiều model khác nhau.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getModelDelegate(resource: string): any {
  const config = getResourceConfig(resource);
  if (!config) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[config.model];
}

/** Chuyển raw body (từ form, toàn bộ là string) thành đúng kiểu dữ liệu Prisma cần. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceFieldValues(resource: string, raw: Record<string, any>) {
  const config = getResourceConfig(resource);
  if (!config) return raw;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};

  for (const field of config.fields) {
    const value = raw[field.key];
    result[field.key] = coerceOne(field, value);
  }

  return result;
}

function coerceOne(field: FieldConfig, value: unknown) {
  if (value === undefined) return undefined;

  switch (field.type) {
    case "number": {
      if (value === "" || value === null || value === undefined) return null;
      const n = Number(value);
      return Number.isNaN(n) ? null : n;
    }
    case "checkbox":
      return Boolean(value);
    case "date": {
      if (!value) return null;
      return new Date(String(value));
    }
    case "tags": {
      if (Array.isArray(value)) return value;
      return String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    case "lines": {
      if (Array.isArray(value)) return value;
      return String(value)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    default:
      return value === "" ? (field.required ? value : null) : value;
  }
}
