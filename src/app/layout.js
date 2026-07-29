import "./globals.css";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://soonipo.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SoonIPO - IPO Calendar and Market Watch",
    template: "%s | SoonIPO",
  },
  description:
    "Track upcoming and recent IPOs with real-time stock snapshots, exchange details, and market context.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "SoonIPO - IPO Calendar and Market Watch",
    description:
      "Track upcoming and recent IPOs with real-time stock snapshots, exchange details, and market context.",
    siteName: "SoonIPO",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoonIPO - IPO Calendar and Market Watch",
    description:
      "Track upcoming and recent IPOs with real-time stock snapshots, exchange details, and market context.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground`}>
        <ThemeProvider>
          <SiteHeader />
          <Suspense fallback={<main className="flex-1" />}>
            <main className="flex-1">{children}</main>
          </Suspense>
        </ThemeProvider>
        <Suspense
          fallback={
            <footer className="mt-10 border-t">
              <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground md:px-8">
                SoonIPO
              </div>
            </footer>
          }
        >
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
