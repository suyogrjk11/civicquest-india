import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 }
    );
  }

  // Nominatim reverse-geocodes coordinates and can return
  // address.postcode when postal data exists for the location.
  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse"
    );

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", latitude.toString());
    url.searchParams.set("lon", longitude.toString());
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("layer", "address");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "KarmaFacie/1.0 (https://karmafacie-india.vercel.app)",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const pincode =
        typeof data?.address?.postcode === "string"
          ? data.address.postcode.trim()
          : "";

      if (/^\d{6}$/.test(pincode)) {
        return NextResponse.json({
          pincode,
          source: "nominatim",
        });
      }
    }
  } catch (error) {
    console.error("Nominatim reverse-geocoding failed:", error);
  }

  // India-focused postal fallback. Its current public API documents
  // coordinate-based nearby-post-office lookup returning pincode.
  try {
    const url = new URL(
      "https://pincodes.nskmultiservices.in/api/v1/pincodes/nearby"
    );

    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());
    url.searchParams.set("radius", "5");
    url.searchParams.set("limit", "5");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (response.ok) {
      const data = await response.json();

      const postOffices = Array.isArray(data?.data?.post_offices)
        ? data.data.post_offices
        : [];

      const nearest = postOffices.find(
        (postOffice: { pincode?: string | number }) =>
          /^\d{6}$/.test(String(postOffice.pincode ?? ""))
      );

      if (nearest) {
        return NextResponse.json({
          pincode: String(nearest.pincode),
          source: "india-post",
        });
      }
    }
  } catch (error) {
    console.error("India postal fallback failed:", error);
  }

  return NextResponse.json({
    pincode: null,
    source: null,
  });
}
