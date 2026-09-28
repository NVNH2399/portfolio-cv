import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Thiếu username hoặc password" }, { status: 400 });
  }

  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
  }

  await createSession(username);
  return NextResponse.json({ ok: true });
}
