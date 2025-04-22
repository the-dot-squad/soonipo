import { NextResponse } from "next/server";
import { getUpcomingIpos } from "@/lib/data";

/**
 * GET /api/ipos
 *
 * Returns up to 100 IPO documents where expectedDate is either
 * in the future (greater than "now") or null (unknown date).
 */
export async function GET() {
  try {
    const ipos = await getUpcomingIpos();

    return NextResponse.json({ total: ipos.length, ipos });
  } catch (error) {
    console.error("[GET /api/ipos] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch IPOs" },
      { status: 500 }
    );
  }
}
