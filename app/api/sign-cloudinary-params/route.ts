import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { paramsToSign } = body as { paramsToSign?: Record<string, string> };

  if (!paramsToSign) {
    return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);
  return NextResponse.json({ signature });
}
