"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, Save, CheckCircle2, X, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: api.getAdminCategories,
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
    shortDescription: "",
    description: "",
    featured: false,
    benefits: [""],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1500);
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));

    // Auto-generate slug from name
    if (field === "name" && typeof value === "string") {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...form.benefits];
    newBenefits[index] = value;
    setForm(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setForm(prev => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const removeBenefit = (index: number) => {
    setForm(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.categoryId) newErrors.categoryId = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutation.mutate({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      benefits: form.benefits.filter(b => b.trim() !== ""),
    });
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to add a product to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Aura Studio Monitor" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug} onChange={e => handleChange("slug", e.target.value)} placeholder="auto-generated" className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={e => handleChange("categoryId", e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select category...</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <Input value={form.shortDescription} onChange={e => handleChange("shortDescription", e.target.value)} placeholder="One-liner for product cards" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Description</label>
              <textarea
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Detailed product description..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader><CardTitle className="text-lg">Pricing & Inventory</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USD) *</label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={e => handleChange("price", e.target.value)} placeholder="0.00" />
                {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input type="number" min="0" value={form.stock} onChange={e => handleChange("stock", e.target.value)} placeholder="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader><CardTitle className="text-lg">Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input value={form.image} onChange={e => handleChange("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
            </div>
            {form.image && (
              <div className="w-32 h-32 rounded-lg bg-muted bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${form.image})` }} />
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Key Benefits</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={addBenefit}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={b} onChange={e => handleBenefitChange(i, e.target.value)} placeholder={`Benefit ${i + 1}`} />
                {form.benefits.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Options */}
        <Card className="bg-card/30 border-white/5">
          <CardContent className="py-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => handleChange("featured", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium">Featured Product</span>
                <p className="text-xs text-muted-foreground">Display this product on the homepage.</p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={mutation.isPending} className="min-w-[160px]">
            {mutation.isPending ? (
              <><LoadingSpinner size={16} className="text-primary-foreground" /> Creating...</>
            ) : (
              <><Save className="w-4 h-4" /> Create Product</>
            )}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          {showSuccess && (
            <span className="flex items-center gap-2 text-sm text-green-500 font-medium animate-in">
              <CheckCircle2 className="w-4 h-4" /> Product created! Redirecting...
            </span>
          )}
          {mutation.isError && (
            <span className="text-sm text-destructive font-medium">Failed to create product. Try again.</span>
          )}
        </div>
      </form>
    </div>
  );
}
