import { NextResponse } from "next/server";
import { getDeliveryRule } from "@/lib/order-pricing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode")?.trim();

  try {
    return NextResponse.json(await getDeliveryRule(pincode));
  } catch (error) {
    console.error("Error fetching delivery charge:", error);
    return NextResponse.json({ charge: 49, minOrderValue: 500 });
  }
}
