import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Providers} from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fotokirsti-frontend-production.up.railway.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fotograf Kirsti Hovde",
    template: "%s | Fotograf Kirsti Hovde",
  },
  description:
    "Portfolio for Fotograf Kirsti Hovde – profesjonell fotografering i Innlandet. Portrett, familie, bryllup, konfirmasjon og produktfotografering i Lillehammer og omegn.",
  authors: [{ name: "Iver Lindholm", url: "https://github.com" }],
  keywords: [
    "Fotograf",
    "Kirsti Hovde",
    "Portfolio",
    "Innlandet",
    "Lillehammer",
    "Portrett",
    "Bryllup",
    "Familiefotografering",
    "Konfirmasjon",
  ],
  openGraph: {
    title: "Fotograf Kirsti Hovde",
    description:
      "Portfolio for Fotograf Kirsti Hovde – profesjonell fotografering i Innlandet.",
    url: "/",
    siteName: "Fotokirsti",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fotograf Kirsti Hovde",
    description: "Portfolio for Fotograf Kirsti Hovde – profesjonell fotografering i Innlandet.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
