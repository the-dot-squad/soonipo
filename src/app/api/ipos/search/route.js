import { connection, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import IPO from "@/models/ipo";

/**
 * GET /api/ipos/search?search=<query>
 *
 * Searches for IPOs by symbol or companyName using a case-insensitive
 * "contains" query (regex). Returns up to 50 matches.
 *
 * Example:
 *   GET /api/ipos/search?q=tesla
 */
export async function GET(request) {
  await connection();

  try {
    await connectDB();

    // Extract query param from the URL
    const q = request.nextUrl.searchParams.get("q");

    // If 'search' is missing or empty, respond with 400
    if (!q) {
      return NextResponse.json(
        { error: "Missing 'q' query parameter." },
        { status: 400 }
      );
    }

    // 1) Simple input validation/cleansing
    //    We remove any suspicious characters to avoid regex injection or heavy queries.
    //    We also limit the length to, e.g., 60 characters.
    const sanitized = q.replace(/[^a-zA-Z0-9\s\.\-_]/g, "").trim();
    if (sanitized.length === 0 || sanitized.length > 60) {
      return NextResponse.json(
        { error: "Invalid search query." },
        { status: 400 }
      );
    }

    // 2) Build the case-insensitive regex. 
    //    We add a small limit (50) to avoid large dumps.
    const ipos = await IPO.find({
      $or: [
        { symbol: { $regex: sanitized, $options: "i" } },
        { companyName: { $regex: sanitized, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .limit(50)
      .exec();

    return NextResponse.json({ total: ipos.length, ipos });
  } catch (error) {
    console.error("[GET /api/ipos/search] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch IPOs by search" },
      { status: 500 }
    );
  }
}
