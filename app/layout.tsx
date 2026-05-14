import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-italic-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WelloWork — Train cognitive performance. Measure what matters.",
  description:
    "Daily cognitive training, longitudinal performance trends, and biomarker-based health insights — in one platform that managers and employees actually use. Built in Sweden.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
