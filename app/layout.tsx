import type { Metadata, Viewport } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { geistMono, geistSans } from "./fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_METADATA.url),
  title: {
    default: DEFAULT_METADATA.title,
    template: `%s - ${DEFAULT_METADATA.siteName}`,
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

// Browser UI colour (mobile address bar etc.) matches the page background.
// This follows the OS colour scheme; it can't see the site's class-based toggle.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-100 dark:focus:bg-zinc-100 dark:focus:text-zinc-900"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full max-w-2xl space-y-20 px-4 pb-24 focus:outline-none"
          >
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
