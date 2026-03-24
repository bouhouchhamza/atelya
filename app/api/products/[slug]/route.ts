import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = store.products.find((p) => p.slug === slug);
  
  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
}
