import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ success: true, data: store.settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // Merge incoming fields into the mutable settings object
    Object.assign(store.settings, body);
    return NextResponse.json({ success: true, data: store.settings });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
