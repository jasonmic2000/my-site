import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F4F4F5] text-[#3F3F46] dark:bg-[#18181B] dark:text-[#D4D4D8] antialiased flex flex-col items-center justify-center scrollbar-hide mx-auto`}
      >
        <Providers>
          <main className="flex-auto min-w-0 max-w-[640px] w-full mt-2 md:mt-6 px-6 sm:px-4 md:px-0">
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
