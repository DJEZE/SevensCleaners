import { NextRequest, NextResponse } from "next/server";

const HOUSTON_COUNTIES = [
  "Harris County",
  "Fort Bend County",
  "Montgomery County",
  "Brazoria County",
  "Galveston County",
  "Liberty County",
  "Chambers County",
  "Waller County",
];

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ valid: false, error: "No address provided." });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    // No API key configured — skip validation and allow booking
    return NextResponse.json({ valid: true });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      return NextResponse.json({ valid: false, error: "Address not found. Please enter a valid address." });
    }

    const components: { types: string[]; long_name: string; short_name: string }[] =
      data.results[0].address_components;

    const state = components.find((c) => c.types.includes("administrative_area_level_1"));
    if (state?.short_name !== "TX") {
      return NextResponse.json({
        valid: false,
        error: "Sorry, we only service the Greater Houston, TX area.",
      });
    }

    const county = components.find((c) => c.types.includes("administrative_area_level_2"));
    if (!county || !HOUSTON_COUNTIES.includes(county.long_name)) {
      return NextResponse.json({
        valid: false,
        error: "Sorry, we don't service that area yet. We cover Greater Houston (Harris, Fort Bend, Montgomery, Brazoria, Galveston, and surrounding counties).",
      });
    }

    return NextResponse.json({ valid: true });
  } catch {
    // On network/API error, fail open so the booking isn't blocked
    return NextResponse.json({ valid: true });
  }
}
