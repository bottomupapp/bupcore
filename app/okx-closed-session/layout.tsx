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
  title: "BottomUP × OKX · Kapalı Oturum",
  description:
    "BottomUP ürün sunumu, OKX merkezinde kapalı oturum. Üç ürün: Trader Marketplace, Social+, Foxy. Türkiye'nin trader'ları, on-chain auto-trade, AI risk denetimi.",
  robots: { index: false, follow: false },
};

export default function OkxDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="tr" className={`okx-deck ${jetbrains.variable} ${archivo.variable}`}>
      {children}
    </div>
  );
}
