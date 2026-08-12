import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

const links = ["Início", "Maquiagem", "Skincare", "Cabelos", "Perfumes", "Ofertas"];

export function Header({ cartCount }: { cartCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 md:px-10 md:py-6">
        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-foreground"
        >
          {open ? <Menu size={20} /> : <Menu size={20} />}
        </button>

        <a href="#top" className="min-w-0 md:flex-1">
          <span className="block font-display text-xl leading-none tracking-[0.32em] md:text-2xl">
            LUMIÈRE
          </span>
          <span className="eyebrow mt-1 hidden text-[0.55rem] md:block">
            Maison de Beauté
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="relative text-[0.8rem] font-light tracking-[0.14em] uppercase text-foreground/80 transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-5">
          <button aria-label="Buscar" className="transition-opacity hover:opacity-60">
            <Search size={18} strokeWidth={1.4} />
          </button>
          <button aria-label="Minha conta" className="transition-opacity hover:opacity-60">
            <User size={18} strokeWidth={1.4} />
          </button>
          <button aria-label="Carrinho" className="relative transition-opacity hover:opacity-60">
            <ShoppingBag size={18} strokeWidth={1.4} />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-deep text-[0.55rem] text-deep-foreground">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          <div className="mb-3 flex justify-end">
            <button aria-label="Fechar menu" onClick={() => setOpen(false)}>
              <X size={18} strokeWidth={1.4} />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm tracking-[0.14em] uppercase text-foreground/80"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}