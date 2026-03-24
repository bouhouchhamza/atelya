import { NextResponse } from "next/server";
import { MOCK_ADDRESSES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_ADDRESSES });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAddress = {
      ...body,
      id: `add_${Date.now()}`,
    };
    return NextResponse.json({ success: true, data: newAddress });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
