import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getResourceConfig } from "@/lib/resources";
import { getModelDelegate, coerceFieldValues } from "@/lib/resource-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const config = getResourceConfig(resource);
  const model = getModelDelegate(resource);
  if (!config || !model) {
    return NextResponse.json({ error: "Resource không tồn tại" }, { status: 404 });
  }

  const hasOrder = config.fields.some((f) => f.key === "order");
  const items = await model.findMany({
    orderBy: hasOrder ? { order: "asc" } : { id: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  // Chỉ admin đã đăng nhập mới được tạo dữ liệu mới
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { resource } = await params;
  const config = getResourceConfig(resource);
  const model = getModelDelegate(resource);
  if (!config || !model) {
    return NextResponse.json({ error: "Resource không tồn tại" }, { status: 404 });
  }

  const body = await req.json();
  const data = coerceFieldValues(resource, body);

  try {
    const created = await model.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Không tạo được — kiểm tra lại dữ liệu (vd slug bị trùng?)" },
      { status: 400 }
    );
  }
}
