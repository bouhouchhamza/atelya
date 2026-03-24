import { NextResponse } from "next/server";
import { MOCK_WISHLIST } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_WISHLIST });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      id: `w_${Date.now()}`,
      productId: body.productId,
    };
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
