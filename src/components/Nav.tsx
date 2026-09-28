import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <header className="no-print border-b border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg italic text-ink">
          nvnh
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/" className="hover:text-accent">
            Trang chủ
          </Link>
          <Link href="/cv" className="hover:text-accent">
            CV
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
