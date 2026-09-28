import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Sparkles,
  Award,
  Trophy,
  FileText,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RESOURCES } from "@/lib/resources";

export const dynamic = "force-dynamic";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Sparkles,
  certificates: Award,
  achievements: Trophy,
  documents: FileText,
};

export default async function AdminDashboard() {
  const counts = await Promise.all(
    Object.entries(RESOURCES).map(async ([key, config]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const count = await (prisma as any)[config.model].count();
      return { key, label: config.label, count };
    })
  );

  return (
    <div>
      <div className="border-b border-line pb-5">
        <h1 className="font-display text-2xl text-ink">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted">
          Sửa dữ liệu ở đây — trang chủ và CV sẽ tự cập nhật ngay, không cần deploy lại.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {counts.map((c) => {
          const Icon = ICONS[c.key] ?? FolderKanban;
          return (
            <Link
              key={c.key}
              href={`/admin/${c.key}`}
              className="group flex items-start justify-between rounded-lg border border-line bg-white p-4 hover:border-accent"
            >
              <div>
                <p className="text-2xl font-medium text-ink">{c.count}</p>
                <p className="mt-0.5 text-sm text-muted">{c.label}</p>
              </div>
              <Icon size={18} className="mt-1 text-muted group-hover:text-accent" />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-sm font-medium text-ink">Lối tắt</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/admin/profile" className="flex items-center gap-1 text-accent hover:underline">
            Sửa thông tin cá nhân <ArrowRight size={14} />
          </Link>
          <Link href="/admin/projects/new" className="flex items-center gap-1 text-accent hover:underline">
            Thêm dự án mới <ArrowRight size={14} />
          </Link>
          <Link href="/" target="_blank" className="flex items-center gap-1 text-accent hover:underline">
            Xem trang chủ <ArrowRight size={14} />
          </Link>
          <Link href="/cv" target="_blank" className="flex items-center gap-1 text-accent hover:underline">
            Xem CV <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
