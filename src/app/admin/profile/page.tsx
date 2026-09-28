import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();
  return (
    <div>
      <div className="border-b border-line pb-5">
        <h1 className="font-display text-2xl text-ink">Thông tin cá nhân</h1>
        <p className="mt-1 text-sm text-muted">
          Hiển thị ở trang bìa portfolio và đầu trang CV.
        </p>
      </div>
      <div className="mt-6">
        <ProfileForm initial={profile} />
      </div>
    </div>
  );
}
