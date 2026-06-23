import type { Metadata } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "../okx-closed-session/styles.css";
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
  title: "BottomUP · Investor Brief",
  description:
    "BottomUP investor brief — Q2 2026 traction and the Vision 2027 thesis. The App Store of Smart Money: verified human traders, algorithmic strategies and AI agents, secured by a real-time AI risk engine.",
  robots: { index: false, follow: false },
};

export default function InvestorBriefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className={`okx-deck ${jetbrains.variable} ${archivo.variable}`}>
      {children}
    </div>
  );
}
