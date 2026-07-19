import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode")?.trim();

  try {
    let zone = null;

    if (pincode) {
      // Find active zone with matching pincode
      zone = await prisma.deliveryZone.findFirst({
        where: {
          isActive: true,
          pincodes: { has: pincode },
        },
      });
    }

    // If no specific zone, find fallback zone (empty pincodes array)
    if (!zone) {
      zone = await prisma.deliveryZone.findFirst({
        where: {
          isActive: true,
          pincodes: { isEmpty: true },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (zone) {
      return NextResponse.json({
        charge: zone.charge,
        minOrderValue: zone.minOrderValue,
      });
    }

    // Default if no zones configured at all
    return NextResponse.json({ charge: 49, minOrderValue: 500 });
  } catch (error) {
    console.error("Error fetching delivery charge:", error);
    return NextResponse.json({ charge: 49, minOrderValue: 500 });
  }
}
