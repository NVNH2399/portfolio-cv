import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

export async function middleware(request: NextRequest) {
  // Trang login thì luôn cho qua, không thì sẽ tạo vòng lặp redirect
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // token het han hoac khong hop le
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
