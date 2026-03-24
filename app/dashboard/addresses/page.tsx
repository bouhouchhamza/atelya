"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Plus, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function CustomerAddressesPage() {
  const { data: addresses, isLoading } = useQuery({ queryKey: ["customer-addresses"], queryFn: api.getCustomerAddresses });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping and billing addresses.</p>
        </div>
        <Button className="shrink-0"><Plus className="w-4 h-4 mr-2" /> Add Address</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {addresses?.map((address) => (
          <Card key={address.id} className="bg-card/30 border-white/5 relative group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{address.label}</h3>
                    {address.isDefault && <Badge variant="secondary" className="mt-1">Default</Badge>}
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-1 text-sm text-foreground/80 pl-[52px]">
                <p className="font-medium text-foreground">{address.fullName}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="pt-2 text-muted-foreground">{address.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <button className="flex flex-col items-center justify-center min-h-[250px] rounded-xl border-2 border-dashed border-border/50 bg-card/10 hover:bg-card/30 hover:border-primary/50 transition-colors gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-lg">Add New Address</span>
        </button>
      </div>
    </div>
  );
}
