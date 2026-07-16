import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return errorResponse("Invalid coordinates.", 400);
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return errorResponse("Coordinates out of range.", 400);
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SriAmmanMushroomFarmsCheckout/1.0 (checkout address autofill)",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return errorResponse("Could not look up address for this location.", 502);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return errorResponse("Address lookup failed. Please try again.", 500);
  }
}
