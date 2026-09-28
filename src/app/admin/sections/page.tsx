import { prisma } from "@/lib/prisma";
import SectionsManager from "@/components/admin/SectionsManager";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const sections = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="border-b border-line pb-5">
        <h1 className="font-display text-2xl text-ink">Bố cục trang chủ</h1>
        <p className="mt-1 text-sm text-muted">
          Sắp xếp thứ tự và ẩn/hiện từng phần trong cuốn portfolio ở trang chủ.
        </p>
      </div>
      <div className="mt-6">
        <SectionsManager initial={sections} />
      </div>
    </div>
  );
}
