import type { Metadata } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "./v2/styles.css";

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
  title: "Analysts — BottomUP",
  description:
    "Performance terminal for BottomUP analysts. Track records, referral codes, install the app.",
};

export default function AnalystLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`analyst-v2 ${jetbrains.variable} ${archivo.variable}`}>
      {children}
    </div>
  );
}
