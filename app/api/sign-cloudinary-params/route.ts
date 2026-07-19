import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    console.error("Cloudinary sign failed: Unauthorized. Session:", session);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) {
    console.error("Cloudinary sign failed: Missing CLOUDINARY_API_SECRET in env");
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  console.log("Cloudinary sign request body:", body);
  let paramsToSign = body?.paramsToSign;

  // In some versions of next-cloudinary, the parameters are sent at the root of the body
  if (!paramsToSign) {
    paramsToSign = { ...body };
  }

  if (!paramsToSign || Object.keys(paramsToSign).length === 0) {
    return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
  }

  try {
    const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);
    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json({ error: "Failed to sign parameters" }, { status: 500 });
  }
}
