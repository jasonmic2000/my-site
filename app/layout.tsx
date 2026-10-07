import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_METADATA } from "@/lib/consts";
import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_METADATA.url),
  title: {
    default: DEFAULT_METADATA.title,
    template: `%s – ${DEFAULT_METADATA.siteName}`,
  },
  description: DEFAULT_METADATA.description,
  openGraph: {
    title: DEFAULT_METADATA.title,
    description: DEFAULT_METADATA.description,
    url: DEFAULT_METADATA.url,
    siteName: DEFAULT_METADATA.siteName,
    locale: DEFAULT_METADATA.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_METADATA.title,
    description: DEFAULT_METADATA.description,
    site: DEFAULT_METADATA.twitterHandle,
    creator: DEFAULT_METADATA.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto mt-2 flex w-full min-w-0 max-w-[640px] flex-col items-center justify-center bg-background text-foreground antialiased md:mt-6`}
      >
        <Providers>
          <Navbar />
          <main className="max-w-2xl space-y-20 px-4 pb-24">{children}</main>
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
