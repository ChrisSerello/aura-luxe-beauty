const testimonials = [
  {
    quote:
      "Recebi a encomenda em dois dias e a embalagem já era uma experiência. O sérum mudou completamente a textura da minha pele.",
    name: "Beatriz Almeida",
    role: "Cliente desde 2023",
  },
  {
    quote:
      "Finalmente uma loja que entende de perfumaria. O atendimento me ajudou a escolher pelo perfil olfativo, não pela tendência.",
    name: "Marina Ferraz",
    role: "São Paulo",
  },
  {
    quote:
      "A paleta Terre Nue é o tipo de produto que você usa e todo mundo pergunta. Discreta e absurdamente pigmentada.",
    name: "Helena Cardoso",
    role: "Maquiadora profissional",
  },
];

export function Testimonials() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 text-center">
          <p className="eyebrow">Elas confiam</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Depoimentos</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-14">
          {testimonials.map((t) => (
            <figure key={t.name} className="text-center md:text-left">
              <span className="font-display text-5xl leading-none text-gold">“</span>
              <blockquote className="mt-3 font-display text-xl leading-relaxed italic md:text-2xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6">
                <p className="text-[0.7rem] tracking-[0.2em] uppercase">{t.name}</p>
                <p className="mt-1 text-sm font-light text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}