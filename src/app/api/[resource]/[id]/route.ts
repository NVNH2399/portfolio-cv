import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getResourceConfig } from "@/lib/resources";
import { getModelDelegate, coerceFieldValues } from "@/lib/resource-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;
  const model = getModelDelegate(resource);
  if (!getResourceConfig(resource) || !model) {
    return NextResponse.json({ error: "Resource không tồn tại" }, { status: 404 });
  }

  const item = await model.findUnique({ where: { id: Number(id) } });
  if (!item) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { resource, id } = await params;
  const model = getModelDelegate(resource);
  if (!getResourceConfig(resource) || !model) {
    return NextResponse.json({ error: "Resource không tồn tại" }, { status: 404 });
  }

  const body = await req.json();
  const data = coerceFieldValues(resource, body);

  try {
    const updated = await model.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Không cập nhật được" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { resource, id } = await params;
  const model = getModelDelegate(resource);
  if (!getResourceConfig(resource) || !model) {
    return NextResponse.json({ error: "Resource không tồn tại" }, { status: 404 });
  }

  await model.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
