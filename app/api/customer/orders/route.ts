import { NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/lib/mock-data";

export async function GET() {
  const data = MOCK_ORDERS.filter((o) => o.customerId === "usr1");
  return NextResponse.json({ success: true, data });
}
