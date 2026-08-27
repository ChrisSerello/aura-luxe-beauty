import makeup from "@/assets/cat-makeup.jpg";
import skincare from "@/assets/cat-skincare.jpg";
import perfume from "@/assets/cat-perfume.jpg";
import hair from "@/assets/cat-hair.jpg";
import body from "@/assets/cat-body.jpg";
import gifts from "@/assets/cat-gifts.jpg";
import type { Product } from "./products";

const categories = [
  { name: "Maquiagem", img: makeup },
  { name: "Skincare", img: skincare },
  { name: "Perfumes", img: perfume },
  { name: "Cabelos", img: hair },
  { name: "Corpo e Banho", img: body },
  { name: "Kits e Presentes", img: gifts },
];

export function Categories({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (name: string) => void;
}) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Escolha o seu ritual</h2>
          </div>
          <p className="max-w-sm text-sm font-light text-muted-foreground">
            Cada categoria reúne apenas o que passou pela nossa curadoria — nada
            além do essencial, nada abaixo do excepcional.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.name).length;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelect(c.name)}
                className="group relative block w-full overflow-hidden text-left"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-deep/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left md:p-6">
                  <h3 className="font-display text-2xl text-deep-foreground md:text-3xl">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-[0.65rem] tracking-[0.2em] uppercase text-deep-foreground/70">
                    {count} {count === 1 ? "produto" : "produtos"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
