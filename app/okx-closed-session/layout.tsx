import type { Metadata } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "./styles.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jetbrains",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OKX × BottomUP — Closed Session",
  description:
    "BottomUP × OKX private session: Trader Marketplace, Social+, and Foxy. Turkey's trading creators routed into OKX Global, with on-chain auto-trade and AI risk supervision.",
  robots: { index: false, follow: false },
};

export default function OkxDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`okx-deck ${jetbrains.variable} ${archivo.variable}`}>
      {children}
    </div>
  );
}
