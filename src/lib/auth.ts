import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = "7d"; // hết hạn sau 7 ngày, phải đăng nhập lại

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Thiếu SESSION_SECRET trong .env — tạo 1 chuỗi ngẫu nhiên dài (vd: openssl rand -base64 32)"
    );
  }
  return new TextEncoder().encode(secret);
}

/** Kiểm tra username/password với bảng AdminUser. Trả về true/false. */
export async function verifyCredentials(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

/** Tạo JWT session sau khi đăng nhập thành công, set vào cookie httpOnly. */
export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày, tính bằng giây
  });
}

/** Xóa cookie session -> đăng xuất. */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Đọc cookie hiện tại, trả về payload nếu hợp lệ, null nếu chưa đăng nhập/hết hạn. */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { username: string };
  } catch {
    // token sai hoặc hết hạn
    return null;
  }
}
