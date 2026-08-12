import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatBRL, type Product } from "./products";

export type CartItem = { product: Product; qty: number };

export function CartDrawer({
  open,
  onOpenChange,
  items,
  onInc,
  onDec,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: CartItem[];
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.product.priceValue * i.qty, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-3xl font-normal">
            Sua sacola
          </SheetTitle>
          <SheetDescription className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
            {items.length === 0
              ? "Nenhum item selecionado"
              : `${items.reduce((s, i) => s + i.qty, 0)} item(ns)`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag size={28} strokeWidth={1} className="text-muted-foreground" />
            <p className="max-w-[16rem] text-sm font-light text-muted-foreground">
              Sua sacola está vazia. Explore nossa curadoria e adicione seus
              favoritos.
            </p>
          </div>
        ) : (
          <div className="-mx-6 flex-1 overflow-y-auto px-6">
            <ul className="divide-y divide-border">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    className="h-24 w-20 shrink-0 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display text-lg leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          aria-label="Diminuir quantidade"
                          onClick={() => onDec(product.id)}
                          className="grid h-8 w-8 place-items-center transition-colors hover:bg-secondary"
                        >
                          <Minus size={12} strokeWidth={1.4} />
                        </button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button
                          aria-label="Aumentar quantidade"
                          onClick={() => onInc(product.id)}
                          className="grid h-8 w-8 place-items-center transition-colors hover:bg-secondary"
                        >
                          <Plus size={12} strokeWidth={1.4} />
                        </button>
                      </div>
                      <span className="text-sm font-light">
                        {formatBRL(product.priceValue * qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label={`Remover ${product.name}`}
                    onClick={() => onRemove(product.id)}
                    className="self-start text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Trash2 size={15} strokeWidth={1.3} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto border-t border-border pt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
              Total
            </span>
            <span className="font-display text-2xl">{formatBRL(total)}</span>
          </div>
          <button
            disabled={items.length === 0}
            className="mt-5 w-full bg-deep py-4 text-[0.68rem] tracking-[0.22em] uppercase text-deep-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalizar compra
          </button>
          <p className="mt-3 text-center text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">
            Frete grátis acima de R$ 350
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}