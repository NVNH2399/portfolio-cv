import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import BookPortfolio from "@/components/BookPortfolio";

// Du lieu doi thuong xuyen qua trang admin -> luon render dong, khong cache tinh
export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [profile, projects, skillGroups, sections, education, experience, certificates, achievements] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.project.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
        include: { media: { orderBy: { order: "asc" } } },
      }),
      prisma.skillGroup.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.homeSection.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.certificate.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.achievement.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    ]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Nav />

      <main className="flex flex-1 items-center justify-center overflow-hidden px-4 py-4">
        <BookPortfolio
          profile={profile}
          projects={projects}
          skillGroups={skillGroups}
          sections={sections}
          education={education}
          experience={experience}
          certificates={certificates}
          achievements={achievements}
        />
      </main>
    </div>
  );
}
