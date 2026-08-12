import hero from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-background pt-24 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 md:grid-cols-[1fr_1fr] md:gap-16 md:px-10 md:pb-24">
        <div className="animate-rise">
          <p className="eyebrow">Nova coleção · 2026</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            A beleza que
            <br />
            <em className="italic text-gold">se percebe</em> antes
            <br />
            de ser dita.
          </h1>
          <p className="mt-7 max-w-md text-sm leading-relaxed font-light text-muted-foreground md:text-base">
            Curadoria de cosméticos, skincare e perfumaria de alto padrão. Fórmulas
            raras, texturas impecáveis e um ritual de beleza feito para quem
            reconhece a diferença.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#produtos"
              className="inline-flex items-center justify-center bg-deep px-9 py-4 text-[0.72rem] tracking-[0.22em] uppercase text-deep-foreground transition-all duration-300 hover:bg-foreground"
            >
              Comprar agora
            </a>
            <a
              href="#colecao"
              className="inline-flex items-center justify-center border border-foreground/25 px-9 py-4 text-[0.72rem] tracking-[0.22em] uppercase text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
            >
              Explorar coleção
            </a>
          </div>
        </div>

        <div className="relative animate-fade">
          <div className="absolute -left-6 -top-6 hidden h-40 w-40 border border-gold/40 md:block" />
          <img
            src={hero}
            alt="Mulher elegante com pele luminosa em campanha de beleza de luxo"
            width={1408}
            height={1760}
            className="relative aspect-[4/5] w-full object-cover"
          />
          <div className="absolute -bottom-6 -right-4 hidden bg-background px-7 py-5 shadow-[var(--shadow-soft)] md:block">
            <p className="font-display text-3xl leading-none">120+</p>
            <p className="eyebrow mt-2">marcas selecionadas</p>
          </div>
        </div>
      </div>
    </section>
  );
}