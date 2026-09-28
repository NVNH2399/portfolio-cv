import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 chuyển connection URL ra khỏi schema.prisma sang file config này.
// File này chỉ dùng cho các lệnh CLI (migrate, studio, db pull...).
// PrismaClient lúc runtime lấy URL qua driver adapter, xem src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
