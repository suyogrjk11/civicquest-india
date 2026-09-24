import { NextResponse } from "next/server";

const INDIA_MAP_URL =
  "https://webgis1.nic.in/nicstreet/rest/services/terraintile/MapServer/0/query";

export async function GET() {
  try {
    const params = new URLSearchParams({
      where: "1=1",
      outFields: "STNAME",
      returnGeometry: "true",
      f: "geojson",
      outSR: "4326",
    });

    const response = await fetch(
      `${INDIA_MAP_URL}?${params.toString()}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `India map service returned ${response.status}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(
      "India map API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load India map data.",
      },
      {
        status: 500,
      }
    );
  }
}