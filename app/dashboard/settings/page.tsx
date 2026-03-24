"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, Shield, Key } from "lucide-react";
import { useState } from "react";

export default function CustomerSettingsPage() {
  const [notifications, setNotifications] = useState({ orders: true, promos: false, newDrops: true });

  return (
    <div className="space-y-8 animate-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your preferences, security, and notifications.</p>
      </div>

      <div className="space-y-6">
        {/* Security & Password */}
        <Card className="bg-card/30 border-white/5">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Security</h3>
                <p className="text-sm text-muted-foreground">Update your password to keep your account safe.</p>
              </div>
            </div>
            
            <div className="grid gap-4 max-w-sm pl-14">
              <Button variant="outline" className="justify-start"><Key className="w-4 h-4 mr-2" /> Change Password</Button>
              <Button variant="outline" className="justify-start">Enable Two-Factor Authentication</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/30 border-white/5">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Notifications</h3>
                <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
              </div>
            </div>
            
            <div className="space-y-4 pl-14">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.orders} 
                  onChange={(e) => setNotifications({...notifications, orders: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20 bg-background accent-primary" 
                />
                <div>
                  <p className="font-medium text-sm">Order Updates</p>
                  <p className="text-xs text-muted-foreground">Tracking and delivery info.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.newDrops} 
                  onChange={(e) => setNotifications({...notifications, newDrops: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20 bg-background accent-primary" 
                />
                <div>
                  <p className="font-medium text-sm">New Product Drops</p>
                  <p className="text-xs text-muted-foreground">Be the first to know about new releases.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.promos} 
                  onChange={(e) => setNotifications({...notifications, promos: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20 bg-background accent-primary" 
                />
                <div>
                  <p className="font-medium text-sm">Promotions & Offers</p>
                  <p className="text-xs text-muted-foreground">Exclusive deals and subscriber perks.</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <div className="pt-8 border-t border-border/50">
          <h4 className="text-destructive font-bold mb-2">Danger Zone</h4>
          <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
