"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowSuccess(true);
      setTimeout(() => router.push("/admin/categories"), 1500);
    },
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));

    // Auto-generate slug from name
    if (field === "name") {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Category name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Add New Category</h1>
          <p className="text-sm text-muted-foreground">Create a new product collection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card/30 border-white/5">
          <CardHeader><CardTitle className="text-lg">Category Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name *</label>
              <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Monitors" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input value={form.slug} onChange={e => handleChange("slug", e.target.value)} placeholder="auto-generated" className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Describe this collection..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input value={form.image} onChange={e => handleChange("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
            </div>
            {form.image && (
              <div className="w-full h-40 rounded-lg bg-muted bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${form.image})` }} />
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={mutation.isPending} className="min-w-[160px]">
            {mutation.isPending ? (
              <><LoadingSpinner size={16} className="text-primary-foreground" /> Creating...</>
            ) : (
              <><Save className="w-4 h-4" /> Create Category</>
            )}
          </Button>
          <Link href="/admin/categories">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          {showSuccess && (
            <span className="flex items-center gap-2 text-sm text-green-500 font-medium animate-in">
              <CheckCircle2 className="w-4 h-4" /> Category created! Redirecting...
            </span>
          )}
          {mutation.isError && (
            <span className="text-sm text-destructive font-medium">Failed to create category. Try again.</span>
          )}
        </div>
      </form>
    </div>
  );
}
