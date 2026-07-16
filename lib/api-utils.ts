import { NextResponse } from "next/server";

export function errorResponse(message: string, status: number = 400, data: Record<string, any> = {}) {
  return NextResponse.json({ message, ...data }, { status });
}
