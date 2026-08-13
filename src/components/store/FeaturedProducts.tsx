import { useState } from "react";
import { Heart, Star, X } from "lucide-react";
import { formatBRL, type Product } from "./products";

export function FeaturedProducts({
  products,
  loading,
  onAdd,
  activeCategory,
  onClearCategory,
}: {
  products: Product[];
  loading: boolean;
  onAdd: (p: Product) => void;
  activeCategory: string | null;
  onClearCategory: () => void;
}) {
  const [favs, setFavs] = useState<string[]>([]);
  const [added, setAdded] = useState<string | null>(null);

  const visible = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  const toggleFav = (id: string) =>
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

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] w-full animate-pulse bg-card" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-sm font-light text-muted-foreground">
            Nenhum produto disponível nesta categoria no momento.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col bg-card transition-shadow duration-500 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="relative overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center bg-secondary text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                  {p.badge && (
                    <span className="absolute left-4 top-4 bg-background/90 px-3 py-1.5 text-[0.58rem] tracking-[0.2em] uppercase">
                      {p.badge}
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
                  <p className="mt-2 flex-1 text-sm font-light text-muted-foreground">
                    {p.description}
                  </p>
                  <p className="mt-5 text-lg font-light tracking-wide">{formatBRL(p.price)}</p>
                  {p.stock <= 0 ? (
                    <p className="mt-5 w-full border border-foreground/10 py-3.5 text-center text-[0.68rem] tracking-[0.22em] uppercase text-muted-foreground">
                      Esgotado
                    </p>
                  ) : (
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
                  )}
                  {p.productUrl && (
                    <a
                      href={p.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-center text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Ver detalhes
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
