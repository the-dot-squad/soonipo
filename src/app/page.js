import { connection } from "next/server";
import { getUpcomingIpos, getPastIpos, getMarketOverview } from "@/lib/data";
import IpoTabs from "@/components/IpoTabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata() {
  await connection();
  return {
    title: `IPO Calendar ${new Date().getFullYear()}`,
    description:
      "Stay ahead of the market with upcoming IPO listings, recent pricing activity, and quick stock context.",
    alternates: {
      canonical: "/",
    },
  };
}

/**
 * This is a Server Component that fetches upcoming & past IPOs
 * (cached for 1 hour) and renders the IpoTabs client component.
 */
export default async function HomePage() {
  await connection();
  const upcomingIpos = await getUpcomingIpos();
  const pastIpos = await getPastIpos();
  const marketOverview = await getMarketOverview();

  return (
    <div className="mx-auto mb-10 w-full max-w-7xl p-4 md:p-8">
      <section className="hero-glow glass mb-8 rounded-2xl p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge>IPO Intelligence</Badge>
          <Badge variant="secondary">{upcomingIpos.length} upcoming</Badge>
          <Badge variant="secondary">{pastIpos.length} past</Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">
          Track IPO momentum before the market opens
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
          SoonIPO gives you a fast view of upcoming and recently priced IPOs with exchange metadata and
          lightweight market snapshots.
        </p>
      </section>

      <Card className="glass overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <IpoTabs upcomingIpos={upcomingIpos} pastIpos={pastIpos} marketOverview={marketOverview} />
        </CardContent>
      </Card>
    </div>
  );
}
