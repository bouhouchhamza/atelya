import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const data = store.products.filter((p) => p.featured);
  return NextResponse.json({ success: true, data });
}
