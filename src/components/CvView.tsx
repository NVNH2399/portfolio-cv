"use client";

import { useState } from "react";
import type {
  Profile,
  Education,
  Experience,
  Project,
  SkillGroup,
  Certificate,
} from "@prisma/client";

type Lang = "vi" | "en";

const t = {
  vi: {
    summary: "Tóm tắt",
    education: "Học vấn",
    experience: "Kinh nghiệm làm việc",
    projects: "Dự án",
    skills: "Kỹ năng",
    certificates: "Chứng chỉ",
    print: "In / PDF",
    present: "nay",
    inProgress: "Đang làm",
    done: "Hoàn thành",
  },
  en: {
    summary: "Summary",
    education: "Education",
    experience: "Work Experience",
    projects: "Projects",
    skills: "Skills",
    certificates: "Certificates",
    print: "Print / PDF",
    present: "present",
    inProgress: "In progress",
    done: "Completed",
  },
};

export default function CvView({
  profile,
  education,
  experience,
  projects,
  skillGroups,
  certificates,
}: {
  profile: Profile | null;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  certificates: Certificate[];
}) {
  const [lang, setLang] = useState<Lang>("vi");
  const s = t[lang];

  if (!profile) return null;

  return (
    <div className="min-h-full bg-paper-dim py-10 print:bg-white print:py-0">
      {/* Thanh công cụ: đổi ngôn ngữ + in/xuất PDF — ẩn khi in */}
      <div className="no-print mx-auto mb-6 flex max-w-4xl items-center justify-between px-6">
        <a href="/" className="text-sm text-accent hover:underline">
          ← Quay lại portfolio
        </a>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border border-line text-sm">
            <button
              onClick={() => setLang("vi")}
              className={`px-3 py-1.5 ${lang === "vi" ? "bg-accent text-white" : "text-ink-soft"}`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 ${lang === "en" ? "bg-accent text-white" : "text-ink-soft"}`}
            >
              English
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-ink px-4 py-1.5 text-sm text-paper hover:opacity-90"
          >
            {s.print}
          </button>
        </div>
      </div>

      {/* Tờ CV */}
      <div className="print-area mx-auto max-w-4xl bg-white px-8 py-10 shadow-sm ring-1 ring-line print:shadow-none print:ring-0 sm:px-12">
        <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-center">
          {profile.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-display text-3xl text-ink">{profile.name}</h1>
            <p className="mt-1 text-ink-soft">
              {lang === "vi" ? profile.titleVi : profile.titleEn}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span>{profile.email}</span>
              <span>{profile.phone}</span>
              <span>{profile.location}</span>
              {profile.github && <span>{profile.github.replace("https://", "")}</span>}
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-10 sm:grid-cols-[minmax(0,280px)_1fr]">
          {/* Cột trái */}
          <div className="space-y-8">
            <section>
              <SectionTitle>{s.summary}</SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {lang === "vi" ? profile.summaryVi : profile.summaryEn}
              </p>
            </section>

            <section>
              <SectionTitle>{s.education}</SectionTitle>
              <div className="mt-3 space-y-4">
                {education.map((e) => (
                  <div key={e.id} className="text-sm">
                    <p className="text-xs text-muted">
                      {e.startYear} – {e.endYear ?? s.present}
                    </p>
                    <p className="font-medium text-ink">{e.school}</p>
                    <p className="text-ink-soft">
                      {lang === "vi" ? e.degreeVi : e.degreeEn}
                    </p>
                    {e.gpa && <p className="text-gold">GPA {e.gpa.toFixed(2)}/4.0</p>}
                    {(lang === "vi" ? e.statusVi : e.statusEn) && (
                      <p className="italic text-muted">
                        {lang === "vi" ? e.statusVi : e.statusEn}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{s.certificates}</SectionTitle>
              <div className="mt-3 space-y-3">
                {certificates.map((c) => (
                  <div key={c.id} className="text-sm">
                    <p className="font-medium text-ink">
                      {lang === "vi" ? c.nameVi : c.nameEn}
                    </p>
                    <p className="text-ink-soft">{c.issuer}</p>
                    <p className="text-xs text-muted">
                      {new Date(c.issueDate).toLocaleDateString("vi-VN")}
                      {c.code ? ` · ${c.code}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Cột phải */}
          <div className="space-y-8">
            <section>
              <SectionTitle>{s.experience}</SectionTitle>
              <div className="mt-3 space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-medium text-ink">
                        {lang === "vi" ? exp.roleVi : exp.roleEn}
                      </p>
                      <p className="text-xs text-muted">
                        {exp.startDate} – {exp.endDate ?? s.present}
                      </p>
                    </div>
                    <p className="text-sm text-ink-soft">{exp.company}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                      {(lang === "vi" ? exp.bulletsVi : exp.bulletsEn).map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{s.projects}</SectionTitle>
              <div className="mt-3 space-y-5">
                {projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-medium text-ink">
                        {lang === "vi" ? p.nameVi : p.nameEn}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          p.status === "done"
                            ? "bg-accent-soft text-accent"
                            : "bg-gold-soft text-gold"
                        }`}
                      >
                        {p.status === "done" ? s.done : s.inProgress}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {lang === "vi" ? p.descVi : p.descEn}
                    </p>
                    <p className="mt-1 text-xs text-gold">{p.techs.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{s.skills}</SectionTitle>
              <div className="mt-3 space-y-2">
                {skillGroups.map((g) => (
                  <div key={g.id} className="flex gap-3 text-sm">
                    <span className="w-28 shrink-0 text-muted">
                      {lang === "vi" ? g.labelVi : g.labelEn}
                    </span>
                    <span className="text-ink-soft">{g.items.join(" · ")}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-lg text-accent border-b border-line pb-2">
      {children}
    </h2>
  );
}
