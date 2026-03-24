import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  
  let data = store.products;
  
  if (category) {
    data = data.filter((p) => p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({ success: true, data });
}
