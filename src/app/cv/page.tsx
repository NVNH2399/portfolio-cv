import { prisma } from "@/lib/prisma";
import CvView from "@/components/CvView";

export const dynamic = "force-dynamic";

export default async function CvPage() {
  const [profile, education, experience, projects, skillGroups, certificates] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.project.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.skillGroup.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.certificate.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    ]);

  return (
    <CvView
      profile={profile}
      education={education}
      experience={experience}
      projects={projects}
      skillGroups={skillGroups}
      certificates={certificates}
    />
  );
}