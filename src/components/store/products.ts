export const CATEGORIES = [
  "Maquiagem",
  "Skincare",
  "Perfumes",
  "Cabelos",
  "Corpo e Banho",
  "Kits e Presentes",
] as const;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  stock: number;
  productUrl: string | null;
  badge: string | null;
  rating: number;
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
