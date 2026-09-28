import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import ThemeInit from "@/components/ThemeInit";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Nguyễn Văn Ngọc Hãi — Portfolio",
  description: "Portfolio & CV cá nhân của Nguyễn Văn Ngọc Hãi, sinh viên Công nghệ thông tin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-paper text-ink">
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
