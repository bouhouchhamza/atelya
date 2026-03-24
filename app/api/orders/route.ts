import { NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create mock order
    const newOrder = {
      ...body,
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    
    // In a real app we'd push to DB, here it's read-only mock but we return success.
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
