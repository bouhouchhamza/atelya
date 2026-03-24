import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ success: true, data: store.products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Resolve category name from ID
    const category = store.categories.find(c => c.id === body.categoryId);

    const newProduct = {
      id: `p_${Date.now()}`,
      name: body.name || "Untitled Product",
      slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, "-") || `product-${Date.now()}`,
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      price: Number(body.price) || 0,
      image: body.image || "",
      categoryId: body.categoryId || "",
      categoryName: category?.name || body.categoryName || "Uncategorized",
      featured: Boolean(body.featured),
      stock: Number(body.stock) || 0,
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      createdAt: new Date().toISOString(),
    };

    store.products.push(newProduct);

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
