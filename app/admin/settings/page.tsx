"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Save, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: api.getAdminSettings,
  });

  const [form, setForm] = useState({
    storeName: "",
    heroTitle: "",
    heroSubtitle: "",
    supportEmail: "",
    currency: "",
    brandTagline: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Populate form when data loads
  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName || "",
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        supportEmail: settings.supportEmail || "",
        currency: settings.currency || "",
        brandTagline: settings.brandTagline || "",
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="max-w-3xl space-y-8 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Store Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your storefront branding and public information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Name</label>
              <Input value={form.storeName} onChange={e => handleChange("storeName", e.target.value)} placeholder="AURA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Tagline</label>
              <Input value={form.brandTagline} onChange={e => handleChange("brandTagline", e.target.value)} placeholder="Built for purists." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input type="email" value={form.supportEmail} onChange={e => handleChange("supportEmail", e.target.value)} placeholder="support@aura.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input value={form.currency} onChange={e => handleChange("currency", e.target.value)} placeholder="USD" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="bg-card/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input value={form.heroTitle} onChange={e => handleChange("heroTitle", e.target.value)} placeholder="ELEVATE YOUR WORKSPACE." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Input value={form.heroSubtitle} onChange={e => handleChange("heroSubtitle", e.target.value)} placeholder="Premium electronics designed for creators." />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={mutation.isPending} className="min-w-[140px]">
            {mutation.isPending ? (
              <><LoadingSpinner size={16} className="text-primary-foreground" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </Button>
          {showSuccess && (
            <span className="flex items-center gap-2 text-sm text-green-500 font-medium animate-in">
              <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
            </span>
          )}
          {mutation.isError && (
            <span className="text-sm text-destructive font-medium">Failed to save settings. Please try again.</span>
          )}
        </div>
      </form>
    </div>
  );
}
