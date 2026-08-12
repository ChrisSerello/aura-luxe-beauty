import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type Product = {
  id: number;
  name: string;
  desc: string;
  price: string;
  priceValue: number;
  rating: number;
  img: string;
  category: string;
  tag?: string;
};

export const products: Product[] = [
  { id: 1, name: "Batom Velours Noir", desc: "Matte aveludado de longa fixação", price: "R$ 289", priceValue: 289, rating: 5, img: p1, category: "Maquiagem", tag: "Best-seller" },
  { id: 2, name: "Sérum Éclat d'Or", desc: "Vitamina C estabilizada e ácido hialurônico", price: "R$ 486", priceValue: 486, rating: 5, img: p2, category: "Skincare", tag: "Novo" },
  { id: 3, name: "Parfum Nuit Blanche", desc: "Âmbar, jasmim e baunilha bourbon", price: "R$ 749", priceValue: 749, rating: 4, img: p3, category: "Perfumes" },
  { id: 4, name: "Creme Riche Absolu", desc: "Nutrição intensa com peptídeos", price: "R$ 592", priceValue: 592, rating: 5, img: p4, category: "Corpo e Banho" },
  { id: 5, name: "Óleo Capilar Soie", desc: "Brilho espelhado sem peso", price: "R$ 234", priceValue: 234, rating: 4, img: p5, category: "Cabelos" },
  { id: 6, name: "Paleta Terre Nue", desc: "Seis tons neutros ultra pigmentados", price: "R$ 398", priceValue: 398, rating: 5, img: p6, category: "Kits e Presentes", tag: "Edição limitada" },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });