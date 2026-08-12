import { useState } from "react";
import { Heart, Star, X } from "lucide-react";
import { products, type Product } from "./products";

export function FeaturedProducts({
  onAdd,
  activeCategory,
  onClearCategory,
}: {
  onAdd: (p: Product) => void;
  activeCategory: string | null;
  onClearCategory: () => void;
}) {
  const [favs, setFavs] = useState<number[]>([]);
  const [added, setAdded] = useState<number | null>(null);

  const visible = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const toggleFav = (id: number) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <section id="produtos" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-12 text-center md:mb-16">
          <p className="eyebrow">Seleção da maison</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            {activeCategory ?? "Produtos em destaque"}
          </h2>
          <div className="hairline mx-auto mt-6 max-w-[120px]" />
          {activeCategory && (
            <button
              onClick={onClearCategory}
              className="mt-6 inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors hover:border-deep hover:bg-deep hover:text-deep-foreground"
            >
              <X size={12} strokeWidth={1.4} /> Ver todos os produtos
            </button>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col bg-card transition-shadow duration-500 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                {p.tag && (
                  <span className="absolute left-4 top-4 bg-background/90 px-3 py-1.5 text-[0.58rem] tracking-[0.2em] uppercase">
                    {p.tag}
                  </span>
                )}
                <button
                  aria-label="Favoritar"
                  onClick={() => toggleFav(p.id)}
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90 transition-colors hover:bg-background"
                >
                  <Heart
                    size={15}
                    strokeWidth={1.4}
                    className={favs.includes(p.id) ? "fill-gold text-gold" : "text-foreground"}
                  />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      strokeWidth={1.2}
                      className={i < p.rating ? "fill-gold text-gold" : "text-border"}
                    />
                  ))}
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm font-light text-muted-foreground">{p.desc}</p>
                <p className="mt-5 text-lg font-light tracking-wide">{p.price}</p>
                <button
                  onClick={() => {
                    onAdd(p);
                    setAdded(p.id);
                    setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1600);
                  }}
                  className="mt-5 w-full border border-foreground/20 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-300 hover:border-deep hover:bg-deep hover:text-deep-foreground"
                >
                  {added === p.id ? "Adicionado ✓" : "Adicionar ao carrinho"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}