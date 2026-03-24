"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight, Monitor, Cpu, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: api.getFeaturedProducts,
  });

  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: api.getSettings,
  });

  return (
    <div className="flex-1 flex flex-col">
        {/* ═══════════════════════════════════════════
             PREMIUM 3D CINEMATIC HERO SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
          
          {/* ── LAYER 0: Deep radial gradient base ── */}
          <div className="absolute inset-0 bg-background -z-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent)] -z-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(59,130,246,0.08),transparent)] -z-20" />

          {/* ── LAYER 1: Primary floating orbs ── */}
          <div className="absolute -z-10 pointer-events-none inset-0 overflow-hidden">
            {/* Large primary blue orb — top-left, slow float */}
            <div
              className="absolute top-[8%] left-[5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-screen"
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
                filter: "blur(80px)",
                animation: "hero-float 12s ease-in-out infinite",
              }}
            />

            {/* Secondary indigo orb — bottom-right, slow drift */}
            <div
              className="absolute bottom-[0%] right-[0%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full mix-blend-screen"
              style={{
                background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.06) 55%, transparent 70%)",
                filter: "blur(90px)",
                animation: "hero-drift 16s ease-in-out infinite",
              }}
            />

            {/* Accent violet orb — mid-right, pulse */}
            <div
              className="absolute top-[50%] right-[15%] w-[20vw] h-[20vw] max-w-[280px] max-h-[280px] rounded-full mix-blend-screen"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)",
                filter: "blur(60px)",
                animation: "hero-orb-pulse 8s ease-in-out infinite",
              }}
            />

            {/* Warm accent — bottom-left, subtle */}
            <div
              className="absolute bottom-[15%] left-[20%] w-[18vw] h-[18vw] max-w-[250px] max-h-[250px] rounded-full mix-blend-screen"
              style={{
                background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%)",
                filter: "blur(70px)",
                animation: "hero-float 10s ease-in-out infinite reverse",
              }}
            />
          </div>

          {/* ── LAYER 2: Glass rings / 3D-like concentric shapes ── */}
          <div className="absolute -z-10 pointer-events-none inset-0 overflow-hidden">
            {/* Large outer ring — top-right */}
            <div
              className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] md:w-[700px] md:h-[700px] rounded-full border border-white/[0.04]"
              style={{
                background: "conic-gradient(from 180deg, transparent, rgba(255,255,255,0.02), transparent 60%)",
                animation: "hero-rotate 60s linear infinite",
              }}
            />
            {/* Inner ring companion */}
            <div
              className="absolute -top-[10%] -right-[6%] w-[450px] h-[450px] md:w-[520px] md:h-[520px] rounded-full border border-white/[0.03]"
              style={{
                background: "conic-gradient(from 90deg, transparent, rgba(99,102,241,0.03), transparent 50%)",
                animation: "hero-rotate 45s linear infinite reverse",
              }}
            />

            {/* Bottom-left ring cluster */}
            <div
              className="absolute -bottom-[20%] -left-[15%] w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full border border-white/[0.03]"
              style={{
                background: "conic-gradient(from 270deg, transparent, rgba(59,130,246,0.03), transparent 40%)",
                animation: "hero-rotate 50s linear infinite",
              }}
            />
          </div>

          {/* ── LAYER 3: Glass panels / perspective depth ── */}
          <div className="absolute -z-10 pointer-events-none inset-0 overflow-hidden hidden md:block">
            {/* Floating glass panel — left */}
            <div
              className="absolute top-[25%] left-[3%] w-[180px] h-[260px] rounded-2xl border border-white/[0.04] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-[2px]"
              style={{
                transform: "perspective(800px) rotateY(12deg) rotateX(-5deg)",
                animation: "hero-float 14s ease-in-out infinite",
              }}
            />
            {/* Floating glass panel — right */}
            <div
              className="absolute top-[35%] right-[5%] w-[140px] h-[200px] rounded-2xl border border-white/[0.04] bg-gradient-to-bl from-white/[0.02] to-transparent backdrop-blur-[2px]"
              style={{
                transform: "perspective(800px) rotateY(-10deg) rotateX(5deg)",
                animation: "hero-drift 18s ease-in-out infinite",
              }}
            />
            {/* Small floating square accent */}
            <div
              className="absolute bottom-[30%] left-[12%] w-[80px] h-[80px] rounded-xl border border-white/[0.05] bg-gradient-to-br from-indigo-500/[0.04] to-transparent"
              style={{
                transform: "perspective(500px) rotateZ(15deg) rotateX(10deg)",
                animation: "hero-orb-pulse 10s ease-in-out infinite",
              }}
            />
          </div>

          {/* ── LAYER 4: Tech grid overlay ── */}
          <div className="absolute inset-0 -z-5 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          {/* ── LAYER 5: Subtle noise texture ── */}
          <div className="absolute inset-0 -z-5 pointer-events-none opacity-[0.015]"  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          {/* ═══════ HERO CONTENT ═══════ */}
          <div className="container relative z-20 px-4 text-center">
            
            {/* Floating Glass Badge */}
            <div className="inline-block mb-6 animate-in hover:scale-105 transition-transform duration-700 cursor-default">
              <div className="glass px-6 py-2.5 rounded-full border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
                <span className="text-primary font-bold tracking-widest text-xs sm:text-sm uppercase text-glow">
                  {settings?.storeName || "AURA"} &mdash; 2026 EDITION
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50 mb-6 drop-shadow-2xl animate-in leading-[0.95]" style={{ animationDelay: "100ms" }}>
              {settings?.heroTitle || "ELEVATE YOUR WORKSPACE."}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto mb-12 font-medium animate-in leading-relaxed" style={{ animationDelay: "200ms" }}>
              {settings?.heroSubtitle || "Premium electronics engineered for uncompromising performance and modern creators."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in" style={{ animationDelay: "300ms" }}>
              <Link href="/products">
                <Button size="lg" className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg w-full sm:w-auto shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all duration-500">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="glass" size="lg" className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg w-full sm:w-auto hover:bg-white/10 border-white/10 hover:border-white/20">
                  Explore Ecosystem
                </Button>
              </Link>
            </div>

            {/* Bottom gradient fade for seamless section transition */}
            <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-30" />
          </div>
        </section>

        {/* PREMIUM FEATURED PRODUCTS */}
        <section className="py-32 bg-background relative z-10 border-t border-white/5">
          <div className="container px-4 mx-auto">
            <SectionTitle 
              title="Reference Grade" 
              subtitle="The pinnacle of modern engineering. Curated for the few."
              centered 
            />
            
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 perspective-1000">
                {featuredProducts?.slice(0, 3).map((product, i) => (
                  <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                    <Card 
                      className="overflow-hidden border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm 
                                 transition-all duration-700 ease-out 
                                 hover:-translate-y-4 hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.1)] 
                                 hover:border-white/20 relative h-[500px] flex flex-col"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {/* Inner Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                      
                      {product.stock === 0 && (
                        <div className="absolute top-4 right-4 z-20 glass px-4 py-1.5 rounded-full text-xs font-bold uppercase text-white/80">Out of Stock</div>
                      )}
                      
                      <div className="h-[60%] relative overflow-hidden bg-black/40 z-10">
                        {/* Immersive Image Zoom on Hover */}
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${product.image})` }} />
                      </div>
                      
                      <CardContent className="p-8 flex-1 flex flex-col justify-end z-10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-2">{product.categoryName}</p>
                            <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-glow transition-all">{product.name}</h3>
                          </div>
                          <span className="text-xl font-light text-white/90">${product.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.shortDescription}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-20">
              <Link href="/products">
                <Button variant="outline" size="lg" className="group h-14 px-8 border-white/10 hover:border-white/30 bg-transparent">
                  View Full Catalog <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* BRAND TECH / ARCHITECTURE SECTION */}
        <section className="py-32 bg-card/10 relative overflow-hidden border-t border-white/5">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] mix-blend-screen rounded-full -z-10 translate-x-1/3 -translate-y-1/3" />
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block mb-4 glass px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-primary">
                  Engineering Zero
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                  Built for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">absolute precision.</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Every product in the Aura ecosystem is forged from aerospace-grade materials, pushing the boundaries of what is possible in modern consumer technology. No plastic fillers. Uncompromised performance.
                </p>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Custom Silicon</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Bespoke DSPs orchestrating every interaction with zero latency.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <Monitor className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Pixel Perfect</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Sub-millimeter calibration across all visual arrays.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Thunderbolt Backbone</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">40Gbps sequential pipelines powering your entire desk.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Titanium Framework</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Structural integrity guaranteed for a lifetime of heavy use.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Decorative Panel */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group perspective-1000">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1200&auto=format&fit=crop')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 p-6 glass rounded-2xl border border-white/10">
                  <p className="text-sm font-medium text-white/90">"The Aura ecosystem completely fundamentally redefines the modern workstation geometry."</p>
                  <p className="text-xs text-primary mt-2 uppercase tracking-widest font-bold">— Tech Design Quarterly</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CINEMATIC CTA */}
        <section className="py-40 relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          
          <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-glow">
              Command your environment.
            </h2>
            <p className="text-2xl text-muted-foreground/80 mb-12 font-medium">
              Step into the future of workflow architecture. 
            </p>
            <Link href="/products">
              <Button size="lg" className="h-16 px-12 text-xl shadow-[0_0_50px_var(--color-primary)] hover:shadow-[0_0_80px_var(--color-primary)] transition-all duration-500 rounded-full">
                Enter The Ecosystem
              </Button>
            </Link>
          </div>
        </section>

    </div>
  );
}
