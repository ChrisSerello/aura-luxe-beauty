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
  const [cart, setCart] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cart} />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts onAdd={() => setCart((c) => c + 1)} />
        <Collection />
        <Benefits />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
