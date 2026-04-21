import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio — Ekip Planlama & Ürün Düşünme",
  description:
    "Ideation, sprint planlama, epic + task, ses → PRD, Medium tarzı ürün makaleleri. Tek çatı altında.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
