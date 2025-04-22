import { NextResponse } from "next/server";
import { getPastIpos } from "@/lib/data.js";

/**
 * GET /api/ipos/past
 *
 * Returns up to 100 IPO documents where expectedDate is strictly
 * before today's date (past IPOs), sorted descending by date.
 */
export async function GET() {
  try {
    // All IPOs that occurred before today
    const ipos = await getPastIpos();
    return NextResponse.json({ total: ipos.length, ipos });
  } catch (error) {
    console.error("[GET /api/ipos/past] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch past IPOs" },
      { status: 500 }
    );
  }
}
