import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <p className="eyebrow">Le Cercle Lumière</p>
        <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
          Faça parte do nosso círculo
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
          Lançamentos em primeira mão, edições numeradas e ofertas reservadas às
          nossas clientes. Sem excessos — apenas o que vale o seu tempo.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setSent(true);
          }}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            aria-label="Seu melhor e-mail"
            className="min-w-0 flex-1 border-b border-foreground/25 bg-transparent px-1 py-3.5 text-sm font-light outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
          />
          <button
            type="submit"
            className="shrink-0 bg-deep px-9 py-4 text-[0.68rem] tracking-[0.22em] uppercase text-deep-foreground transition-colors duration-300 hover:bg-foreground"
          >
            {sent ? "Bem-vinda ✓" : "Quero receber"}
          </button>
        </form>
      </div>
    </section>
  );
}