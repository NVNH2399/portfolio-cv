"use client";

import { useEffect } from "react";

// Thay the cho <script> inline trong layout.tsx - Next.js/React ban moi
// (16.x/19.x) canh bao voi moi <script> render truc tiep trong cay React,
// nen chuyen qua chay 1 lan luc mount bang useEffect. Danh doi: co the co
// 1 nhap nhay rat ngan mau sang truoc khi doi sang dark cho nguoi da chon
// dark tu truoc - chap nhan duoc de doi lay code don gian, khong loi.
export default function ThemeInit() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const theme =
        stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, []);

  return null;
}
