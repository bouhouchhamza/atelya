import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prod = store.products.find((p) => p.id === id);
  if (!prod) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: prod });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    store.products[index] = { ...store.products[index], ...body };
    return NextResponse.json({ success: true, data: store.products[index] });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  store.products.splice(index, 1);
  return NextResponse.json({ success: true, message: "Deleted successfully" });
}
