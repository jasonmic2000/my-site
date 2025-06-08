import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_METADATA } from "@/lib/consts";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";

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
    template: "%s – Jason Michael", // 👈 Shows "Page Title – Jason Michael"
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F4F4F5] text-[#3F3F46] dark:bg-[#18181B] dark:text-[#D4D4D8] antialiased flex flex-col items-center justify-center scrollbar-hide mx-auto min-w-0 max-w-[640px] w-full mt-2 md:mt-6`}
      >
        <Providers>
          <>
            <Navbar />
            <main className="space-y-20 px-4 pb-24 max-w-2xl">{children}</main>
            <Footer />
          </>
        </Providers>
      </body>
    </html>
  );
}
