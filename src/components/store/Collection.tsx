import collection from "@/assets/collection.jpg";

export function Collection() {
  return (
    <section id="colecao" className="bg-deep text-deep-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-0 md:grid-cols-2">
        <img
          src={collection}
          alt="Frasco de perfume dourado da coleção exclusiva Or Privé"
          loading="lazy"
          width={1408}
          height={1008}
          className="h-full min-h-[380px] w-full object-cover md:min-h-[620px]"
        />
        <div className="px-5 py-16 md:px-16 md:py-24">
          <p className="eyebrow text-gold">Coleção exclusiva</p>
          <h2 className="mt-6 font-display text-4xl leading-tight md:text-6xl">
            Or Privé
          </h2>
          <div className="mt-8 max-w-md space-y-5 text-sm leading-relaxed font-light text-deep-foreground/75 md:text-base">
            <p>
              Uma coleção de doze peças produzidas em séries numeradas, nascidas da
              colaboração entre perfumistas de Grasse e nossos laboratórios em São
              Paulo.
            </p>
            <p>
              Extratos raros, frascos de vidro soprado à mão e acabamento em ouro
              fosco. Feita para permanecer — na pele e na memória.
            </p>
          </div>
          <a
            href="#produtos"
            className="mt-10 inline-flex items-center border border-gold/60 px-9 py-4 text-[0.72rem] tracking-[0.22em] uppercase text-gold transition-colors duration-300 hover:bg-gold hover:text-gold-foreground"
          >
            Descobrir a coleção
          </a>
        </div>
      </div>
    </section>
  );
}