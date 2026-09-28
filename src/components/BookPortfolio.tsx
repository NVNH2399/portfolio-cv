"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type {
  Profile,
  Project,
  SkillGroup,
  Media,
  HomeSection,
  Education,
  Experience,
  Certificate,
  Achievement,
} from "@prisma/client";

type ProjectWithMedia = Project & { media: Media[] };

export default function BookPortfolio({
  profile,
  projects,
  skillGroups,
  sections,
  education,
  experience,
  certificates,
  achievements,
}: {
  profile: Profile | null;
  projects: ProjectWithMedia[];
  skillGroups: SkillGroup[];
  sections: HomeSection[];
  education: Education[];
  experience: Experience[];
  certificates: Certificate[];
  achievements: Achievement[];
}) {
  // Hook luon phai goi truoc moi return de khong pha vo rules-of-hooks,
  // ke ca khi profile null (truong hop chua seed du lieu).
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFlippingRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const totalRef = useRef(0);

  // Lan chuot / vuot (touch) de lat trang thay vi phai bam nut.
  // Dung native event (khong phai onWheel cua React) vi React gan
  // wheel/touchmove o che do passive mac dinh -> goi preventDefault se
  // khong an thua, phai tu them listener voi { passive: false }.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function goNext() {
      setCurrent((c) => Math.min(c + 1, totalRef.current - 1));
    }
    function goPrev() {
      setCurrent((c) => Math.max(c - 1, 0));
    }
    function flip(dir: 1 | -1) {
      if (isFlippingRef.current) return;
      isFlippingRef.current = true;
      if (dir > 0) goNext();
      else goPrev();
      setTimeout(() => {
        isFlippingRef.current = false;
      }, 650); // khop voi thoi gian transition lat trang ben duoi
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const threshold = 35;
      wheelAccumRef.current += e.deltaY;
      if (Math.abs(wheelAccumRef.current) < threshold) return;
      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      flip(dir);
    }

    function onTouchStart(e: TouchEvent) {
      touchStartYRef.current = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.touches[0].clientY;
      if (Math.abs(delta) < 45) return;
      flip(delta > 0 ? 1 : -1);
      touchStartYRef.current = e.touches[0].clientY;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  if (!profile) return null;

  // Neu chua co du lieu sections (vd chua chay seed/migrate moi), mac dinh
  // hien du 4 phan theo thu tu goc de trang khong bi trong.
  const orderedSections =
    sections.length > 0
      ? [...sections].sort((a, b) => a.order - b.order)
      : [
          { key: "cover", visible: true },
          { key: "intro", visible: true },
          { key: "projects", visible: true },
          { key: "skills", visible: true },
        ];

  const pages: React.ReactNode[] = [];
  for (const section of orderedSections) {
    if (!section.visible) continue;
    if (section.key === "cover") {
      pages.push(<CoverPage profile={profile} key="cover" />);
        } else if (section.key === "intro") {
      pages.push(<IntroPage profile={profile} key="intro" />);
    } else if (section.key === "education" && education.length > 0) {
      pages.push(<EducationPage education={education} key="education" />);
    } else if (section.key === "experience" && experience.length > 0) {
      pages.push(<ExperiencePage experience={experience} key="experience" />);
    } else if (section.key === "projects") {
      pages.push(...projects.map((p) => <ProjectPage project={p} key={p.id} />));
    } else if (section.key === "certificates" && certificates.length > 0) {
      pages.push(<CertificatesPage certificates={certificates} key="certificates" />);
    } else if (section.key === "achievements" && achievements.length > 0) {
      pages.push(<AchievementsPage achievements={achievements} key="achievements" />);
    } else if (section.key === "skills") {
      pages.push(<SkillsPage skillGroups={skillGroups} profile={profile} key="skills" />);
    }
  }
  totalRef.current = pages.length;

  if (pages.length === 0) {
    return (
      <p className="text-sm text-muted">
        Chưa có phần nào được bật hiển thị — vào trang admin để bật lại.
      </p>
    );
  }


  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full max-w-3xl select-none flex-col items-center justify-center"
      style={{ perspective: "2200px", touchAction: "none" }}
    >
      <div className="relative h-[min(78vh,680px)] w-full">
        {pages.map((content, i) => {
          const turned = i < current;
          const distance = Math.abs(i - current);
          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-line bg-white dark:bg-[#232a26]"
              style={{
                transformOrigin: "left center",
                transform: `rotateY(${turned ? -180 : 0}deg)`,
                transition: "transform 0.6s cubic-bezier(.4,.2,.2,1)",
                backfaceVisibility: "hidden",
                zIndex: turned ? i : pages.length - i,
                boxShadow: turned
                  ? "none"
                  : `${2 + distance}px ${2 + distance}px ${10 + distance * 2}px rgba(31,42,36,0.12)`,
              }}
            >
              <div className="h-full w-full overflow-hidden">{content}</div>
            </div>
          );
        })}
      </div>

      <p className="no-print mt-4 text-xs text-muted">
        Lăn chuột hoặc vuốt để chuyển trang · {current + 1} / {pages.length}
      </p>
    </div>
  );
}

// Trang bia: padding rong, can giua, "tho" hon han cac trang con lai +
// anh dai dien (neu co) + 1 hoa tiet duong net rat nhe o gop duoi lam diem nhan ca nhan.
function CoverPage({ profile }: { profile: Profile }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-10 py-10 text-center sm:px-16">
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.08]"
        viewBox="0 0 400 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 50 Q 40 20 80 50 T 160 50 T 240 50 T 320 50 T 400 50"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <path
          d="M0 65 Q 40 35 80 65 T 160 65 T 240 65 T 320 65 T 400 65"
          stroke="var(--gold)"
          strokeWidth="2"
        />
      </svg>

      {profile.avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="h-24 w-24 rounded-full border border-line object-cover sm:h-28 sm:w-28"
        />
      )}

      <p className={profile.avatarUrl ? "mt-5 text-sm text-muted" : "text-sm text-muted"}>
        {profile.location}
      </p>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{profile.name}</h1>
      <p className="mt-2 text-lg text-ink-soft">{profile.titleVi}</p>
      <p className="mt-10 text-xs uppercase tracking-widest text-gold">Lăn chuột để xem thêm ↓</p>
    </div>
  );
}

// Trang gioi thieu: padding rong tuong tu bia, van con "tho" vi la trang dan nhap.
function IntroPage({ profile }: { profile: Profile }) {
  return (
    <div className="flex h-full flex-col justify-center px-10 py-10 sm:px-14">
      <h2 className="font-display text-2xl text-accent">Giới thiệu</h2>
      <p className="mt-4 leading-relaxed text-ink-soft">{profile.summaryVi}</p>
      <div className="mt-8 space-y-2 text-sm">
        <a href={`mailto:${profile.email}`} className="block w-fit text-accent hover:underline">
          {profile.email}
        </a>
        {profile.github && (
          <a href={profile.github} target="_blank" className="block w-fit text-accent hover:underline">
            GitHub
          </a>
        )}
        <Link href="/cv" className="block w-fit text-accent hover:underline">
          Xem CV đầy đủ →
        </Link>
      </div>
    </div>
  );
}

// Trang du an: padding hep hon, sat le hon - tao nhip "dac" hon so voi 2 trang tren,
// co anh bia (coverImage) o dau + dai anh/video minh hoa (media) neu co.
function ProjectPage({ project }: { project: ProjectWithMedia }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.nameVi}
          className="mb-4 h-28 w-full shrink-0 rounded-lg border border-line object-cover sm:h-36"
        />
      )}
      <p className="text-xs text-muted">
        {project.startDate}
        {project.endDate ? ` – ${project.endDate}` : project.status === "in_progress" ? " – nay" : ""}
      </p>
      <h2 className="mt-1 font-display text-xl text-ink sm:text-2xl">{project.nameVi}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.descVi}</p>

      {project.media.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {project.media.map((m: Media) =>
            m.type === "video" ? (
              <video
                key={m.id}
                src={m.url}
                controls
                muted
                className="h-24 w-36 shrink-0 rounded-md border border-line object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={m.id}
                src={m.url}
                alt=""
                className="h-24 w-36 shrink-0 rounded-md border border-line object-cover"
              />
            )
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techs.map((t: string) => (
          <span
            key={t}
            className="rounded-full border border-line px-3 py-1 text-xs text-gold transition-colors hover:border-gold hover:bg-gold-soft"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" className="text-accent hover:underline">
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" className="text-accent hover:underline">
            Demo
          </a>
        )}
      </div>
    </div>
  );
}

function EducationPage({ education }: { education: Education[] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl text-accent">Học vấn</h2>
      <div className="mt-4 space-y-5">
        {education.map((e) => (
          <div key={e.id}>
            <p className="text-xs text-muted">
              {e.startYear} – {e.endYear ?? "nay"}
            </p>
            <p className="mt-0.5 font-medium text-ink">{e.school}</p>
            <p className="text-sm text-ink-soft">{e.degreeVi}</p>
            {e.gpa && <p className="text-sm text-gold">GPA {e.gpa.toFixed(2)}/4.0</p>}
            {e.statusVi && <p className="text-xs italic text-muted">{e.statusVi}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperiencePage({ experience }: { experience: Experience[] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl text-accent">Kinh nghiệm làm việc</h2>
      <div className="mt-4 space-y-5">
        {experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-medium text-ink">{exp.roleVi}</p>
              <p className="text-xs text-muted">
                {exp.startDate} – {exp.endDate ?? "nay"}
              </p>
            </div>
            <p className="text-sm text-ink-soft">{exp.company}</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {exp.bulletsVi.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesPage({ certificates }: { certificates: Certificate[] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl text-accent">Chứng chỉ</h2>
      <div className="mt-4 space-y-4">
        {certificates.map((c) => (
          <div key={c.id} className="flex gap-3">
            {c.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.imageUrl}
                alt={c.nameVi}
                className="h-16 w-16 shrink-0 rounded-md border border-line object-cover"
              />
            )}
            <div>
              <p className="font-medium text-ink">{c.nameVi}</p>
              <p className="text-sm text-ink-soft">{c.issuer}</p>
              <p className="text-xs text-muted">
                {new Date(c.issueDate).toLocaleDateString("vi-VN")}
                {c.code ? ` · ${c.code}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsPage({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl text-accent">Thành tựu</h2>
      <div className="mt-4 space-y-4">
        {achievements.map((a) => (
          <div key={a.id} className="flex gap-3">
            {a.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.imageUrl}
                alt={a.titleVi}
                className="h-16 w-16 shrink-0 rounded-md border border-line object-cover"
              />
            )}
            <div>
              <p className="font-medium text-ink">{a.titleVi}</p>
              {a.descVi && <p className="text-sm text-ink-soft">{a.descVi}</p>}
              {a.date && (
                <p className="text-xs text-muted">{new Date(a.date).toLocaleDateString("vi-VN")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trang ky nang: padding hep tuong tu trang du an de giu nhip "dac" o nhom noi dung lam viec,
// khac voi nhip "tho" cua bia/gioi thieu.
function SkillsPage({ skillGroups, profile }: { skillGroups: SkillGroup[]; profile: Profile }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl text-accent">Kỹ năng</h2>
      <div className="mt-4 space-y-4">
        {skillGroups.map((g) => (
          <div key={g.id}>
            <p className="text-sm text-muted">{g.labelVi}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {g.items.map((item: string) => (
                <span
                  key={item}
                  className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">Cảm ơn bạn đã xem hết cuốn portfolio này 👋</p>
      <a href={`mailto:${profile.email}`} className="mt-2 inline-block w-fit text-accent hover:underline">
        {profile.email}
      </a>
    </div>
  );
}
