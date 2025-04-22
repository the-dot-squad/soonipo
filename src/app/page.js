import { getUpcomingIpos, getPastIpos } from "@/lib/data";
import IpoTabs from "@/components/IpoTabs";

export async function generateMetadata() {
  return {
    title: `Soon IPO | Upcoming IPOs, Market Trends & Pre-IPO Insights ${new Date().getFullYear()}`,
    description: "Stay ahead of the market with our IPO Tracker. Get the investor news, company filings, launch dates, and expert insights. Discover the next big opportunity before it hits the exchange.",
  }
}

/**
 * This is a Server Component that fetches upcoming & past IPOs
 * (cached for 1 hour) and renders the IpoTabs client component.
 */
export default async function HomePage() {
  // Server-side fetching with 1hr cache
  const upcomingIpos = await getUpcomingIpos();
  const pastIpos = await getPastIpos();

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Soon IPO: Get Ahead of the Market</h1>

        <IpoTabs upcomingIpos={upcomingIpos} pastIpos={pastIpos} />
      </div>
    </>
  );
}
