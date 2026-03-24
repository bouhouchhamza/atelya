import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ord = store.orders.find((o) => o.id === id);
  if (!ord) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: ord });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = store.orders.findIndex((o) => o.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    store.orders[index] = { ...store.orders[index], ...body };
    return NextResponse.json({ success: true, data: store.orders[index] });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
