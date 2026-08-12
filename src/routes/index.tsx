import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/store/Header";
import { Hero } from "@/components/store/Hero";
import { Categories } from "@/components/store/Categories";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { Collection } from "@/components/store/Collection";
import { Benefits } from "@/components/store/Benefits";
import { Testimonials } from "@/components/store/Testimonials";
import { Newsletter } from "@/components/store/Newsletter";
import { Footer } from "@/components/store/Footer";
import { CartDrawer, type CartItem } from "@/components/store/CartDrawer";
import type { Product } from "@/components/store/products";

const title = "Maison Lumière — Beleza Feminina de Alto Padrão";
const description =
  "Loja de beleza de luxo: maquiagem, skincare, perfumaria, cabelos e kits presente com curadoria exclusiva e embalagem premium.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const count = items.reduce((s, i) => s + i.qty, 0);

  const addItem = (product: Product) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      return found
        ? prev.map((i) =>
            i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
          )
        : [...prev, { product, qty: 1 }];
    });

  const changeQty = (id: number, delta: number) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.id === id ? { ...i, qty: i.qty + delta } : i,
        )
        .filter((i) => i.qty > 0),
    );

  const selectCategory = (name: string) => {
    setCategory(name);
    document
      .getElementById("produtos")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={count} onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Categories onSelect={selectCategory} />
        <FeaturedProducts
          onAdd={addItem}
          activeCategory={category}
          onClearCategory={() => setCategory(null)}
        />
        <Collection />
        <Benefits />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        onInc={(id) => changeQty(id, 1)}
        onDec={(id) => changeQty(id, -1)}
        onRemove={(id) =>
          setItems((prev) => prev.filter((i) => i.product.id !== id))
        }
      />
    </div>
  );
}
