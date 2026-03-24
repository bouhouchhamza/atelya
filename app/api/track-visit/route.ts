import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // In a real app this would write a visit to DB or analytics provider
  return NextResponse.json({ success: true, message: "Visit recorded" });
}
