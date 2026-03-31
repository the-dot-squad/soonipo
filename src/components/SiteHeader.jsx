import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
              <Image src="/logo.svg" alt="Soon IPO logo" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="leading-tight">
              <p className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-lg font-black tracking-[0.22em] text-transparent">
                SOON IPO
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Market Radar
              </p>
            </div>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
