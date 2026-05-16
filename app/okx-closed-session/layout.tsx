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
    "BottomUP ürün sunumu — kapalı oturum. Üç ürün: Trader Marketplace, Social+, Foxy. Creator economy for traders, on-chain auto-trade, AI risk asistanı.",
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
