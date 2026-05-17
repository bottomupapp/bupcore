import type { Metadata } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "../okx-closed-session/styles.css";

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
  title: "BottomUP · Vision 2027",
  description:
    "BottomUP product showcase — Vision 2027. Three products: Trader Marketplace, Social+, Foxy. Creator economy for traders, on-chain auto-trade, AI risk assistant.",
  robots: { index: false, follow: false },
};

export default function Vision2027Layout({
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
