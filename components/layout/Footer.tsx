import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-4">
        
        <div className="flex flex-col space-y-4">
          <span className="text-2xl font-bold tracking-widest text-foreground">AURA</span>
          <p className="text-sm text-muted-foreground max-w-xs">
            Built for clarity. Designed for performance. Elevate your daily ritual with premium essentials.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-foreground">Shop</h4>
          <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
          <Link href="/categories/focus-flow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Focus & Flow</Link>
          <Link href="/categories/rest-recovery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rest & Recovery</Link>
          <Link href="/categories/vitality" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Vitality</Link>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-foreground">Company</h4>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Story</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-semibold text-foreground">Legal</h4>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/refunds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
        </div>

      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} AURA Essentials. All rights reserved.
      </div>
    </footer>
  );
}
