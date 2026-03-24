"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function CustomerProfilePage() {
  const { data: profile, isLoading } = useQuery({ queryKey: ["customer-profile"], queryFn: api.getCustomerProfile });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name, email: profile.email, phone: profile.phone });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-8 animate-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account security.</p>
      </div>

      <Card className="bg-card/30 border-white/5">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-border/50">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <UserCircle className="w-12 h-12 text-primary" />
              </div>
              <div>
                <Button type="button" variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Alex Mercer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 555-0192"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size={16} className="mr-2 text-primary-foreground" /> : null}
                {saved ? "Saved Successfully" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
