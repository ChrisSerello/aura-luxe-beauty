import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

const columns = [
  {
    title: "A Maison",
    links: ["Nossa história", "Curadoria", "Sustentabilidade", "Imprensa", "Trabalhe conosco"],
  },
  {
    title: "Atendimento",
    links: ["Central de ajuda", "Rastrear pedido", "Trocas e devoluções", "Consultoria de beleza"],
  },
  {
    title: "Políticas",
    links: ["Privacidade", "Termos de uso", "Entrega", "Reembolso", "Cookies"],
  },
];

export function Footer() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="block font-display text-2xl tracking-[0.32em]">LUMIÈRE</span>
            <span className="eyebrow mt-2 block text-[0.55rem] text-gold">Maison de Beauté</span>
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-deep-foreground/60">
              Beleza de alto padrão, selecionada com critério e entregue com cuidado
              em todo o Brasil.
            </p>
            <div className="mt-7 flex gap-5">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Rede social"
                  className="text-deep-foreground/70 transition-colors hover:text-gold"
                >
                  <Icon size={18} strokeWidth={1.3} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="text-[0.65rem] tracking-[0.22em] uppercase text-gold">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm font-light text-deep-foreground/65 transition-colors hover:text-deep-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-deep-foreground/15 pt-8 text-sm font-light text-deep-foreground/60 sm:grid-cols-3">
          <p className="flex items-center gap-2">
            <Mail size={14} strokeWidth={1.3} /> contato@maisonlumiere.com.br
          </p>
          <p className="flex items-center gap-2">
            <Phone size={14} strokeWidth={1.3} /> +55 11 4000-2200
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} strokeWidth={1.3} /> Rua Haddock Lobo, 1520 — São Paulo
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-deep-foreground/15 pt-8 md:flex-row">
          <p className="text-xs font-light text-deep-foreground/50">
            © 2026 Maison Lumière. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "Master", "Amex", "Elo", "Pix", "Boleto"].map((m) => (
              <span
                key={m}
                className="border border-deep-foreground/20 px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-deep-foreground/60"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}