"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  return (
    <div className="flex-1 bg-background pt-24 pb-32">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Collections" 
          subtitle="Curated electronics designed to elevate every aspect of your workspace."
          centered
        />

        {isLoading ? (
          <div className="flex justify-center py-32"><LoadingSpinner size={40} className="text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
            {categories?.map((cat) => (
              <Link href={`/products?category=${cat.id}`} key={cat.id} className="group block h-full">
                <div className="relative aspect-[3/2] lg:aspect-video rounded-2xl overflow-hidden glass border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-cover bg-center mix-blend-normal transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${cat.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
                    <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">{cat.name}</h2>
                    <p className="text-lg text-white/80 mb-6 max-w-sm">{cat.description}</p>
                    
                    <div className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-white group-hover:text-white/70 transition-colors">
                      Explore Collection <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
