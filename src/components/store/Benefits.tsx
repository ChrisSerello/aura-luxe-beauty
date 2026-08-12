import { Gem, Truck, ShieldCheck, MessageCircle, Gift } from "lucide-react";

const items = [
  { icon: Gem, title: "Produtos selecionados", text: "Curadoria própria, marca a marca." },
  { icon: Truck, title: "Envio rápido", text: "Despacho em até 24 horas úteis." },
  { icon: ShieldCheck, title: "Compra segura", text: "Pagamento criptografado." },
  { icon: MessageCircle, title: "Atendimento especializado", text: "Consultoria de beleza real." },
  { icon: Gift, title: "Embalagem premium", text: "Caixa assinada e lacre em cetim." },
];

export function Benefits() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 border-y border-border py-12 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((i) => (
            <div key={i.title} className="text-center">
              <i.icon size={22} strokeWidth={1.1} className="mx-auto text-gold" />
              <h3 className="mt-4 text-[0.7rem] tracking-[0.2em] uppercase">{i.title}</h3>
              <p className="mt-2 text-sm font-light text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}