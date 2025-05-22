import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev.jasonjmichael.com"),
  title: "Jason Michael",
  description: "Jason Michael's Portfolio Site",
  openGraph: {
    siteName: "Jason Michael",
    type: "website",
    title: "Jason Michael",
  },
  twitter: {
    title: "Jason Michael",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="max-h-auto relative flex min-h-screen flex-col items-center bg-slate-100 dark:bg-slate-900 selection:bg-slate-200/30 overflow-x-hidden">
          <div className="flex h-full w-full">
            <Navbar />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
