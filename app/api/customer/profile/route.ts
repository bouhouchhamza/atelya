import { NextResponse } from "next/server";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: MOCK_CUSTOMERS[0] });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updatedCustomer = { ...MOCK_CUSTOMERS[0], ...body };
  return NextResponse.json({ success: true, data: updatedCustomer });
}
