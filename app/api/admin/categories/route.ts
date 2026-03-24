import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ success: true, data: store.categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newCategory = {
      id: `c_${Date.now()}`,
      name: body.name || "Untitled Category",
      slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, "-") || `category-${Date.now()}`,
      description: body.description || "",
      image: body.image || "",
    };

    store.categories.push(newCategory);

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
