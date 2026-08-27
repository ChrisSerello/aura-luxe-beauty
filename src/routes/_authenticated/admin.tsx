import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, Eye, EyeOff, Upload, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, formatBRL } from "@/components/store/products";

const title = "Painel de produtos — Maison Lumière";
const description = "Área de gestão de produtos, imagens, preços e estoque da loja Maison Lumière.";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Row = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  image_path: string | null;
  stock: number;
  product_url: string | null;
  badge: string | null;
  rating: number;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  product_url: string;
  badge: string;
  rating: string;
  sort_order: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  stock: "0",
  product_url: "",
  badge: "",
  rating: "5",
  sort_order: "0",
  is_active: true,
};

const field =
  "mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-deep";
const label = "eyebrow block text-[0.6rem]";

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data as Row[];
    },
  });

  useEffect(() => {
    const paths = rows.map((r) => r.image_path).filter((p): p is string => !!p);
    if (paths.length === 0) return;
    let cancelled = false;
    supabase.storage
      .from("produtos")
      .createSignedUrls(paths, 60 * 60)
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map: Record<string, string> = {};
        for (const u of data) if (u.path && u.signedUrl) map[u.path] = u.signedUrl;
        setThumbs(map);
      });
    return () => {
      cancelled = true;
    };
  }, [rows]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setForm({
      name: row.name,
      description: row.description,
      price: String(row.price),
      category: row.category,
      stock: String(row.stock),
      product_url: row.product_url ?? "",
      badge: row.badge ?? "",
      rating: String(row.rating),
      sort_order: String(row.sort_order),
      is_active: row.is_active,
    });
    setFile(null);
    setPreview(row.image_path ? (thumbs[row.image_path] ?? null) : row.image_url);
    setShowForm(true);
  };

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem (JPG ou PNG).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("A imagem precisa ter no máximo 5 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["store-products"] });
  }, [queryClient]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Dê um nome ao produto.");
    const price = Number(form.price.replace(",", "."));
    if (!Number.isFinite(price) || price < 0) return toast.error("Informe um preço válido.");

    setSaving(true);
    try {
      let image_path = editing?.image_path ?? null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `produtos/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("produtos")
          .upload(path, file, { upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        image_path = path;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        stock: Number(form.stock) || 0,
        product_url: form.product_url.trim() || null,
        badge: form.badge.trim() || null,
        rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
        image_path,
      };

      const { error } = editing
        ? await supabase.from("products").update(payload).eq("id", editing.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;

      toast.success(editing ? "Produto atualizado!" : "Produto criado!");
      setShowForm(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row: Row) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(row.is_active ? "Produto ocultado da loja." : "Produto visível na loja.");
    refresh();
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Excluir "${row.name}" definitivamente?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    if (row.image_path) await supabase.storage.from("produtos").remove([row.image_path]);
    toast.success("Produto excluído.");
    refresh();
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-5 md:px-8">
          <div className="flex-1">
            <span className="font-display text-xl tracking-[0.3em]">LUMIÈRE</span>
            <span className="eyebrow mt-1 block text-[0.55rem]">Painel de produtos</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 border border-border px-4 py-2.5 text-[0.62rem] tracking-[0.18em] uppercase hover:bg-secondary"
          >
            <Store size={14} strokeWidth={1.4} /> Ver loja
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 border border-border px-4 py-2.5 text-[0.62rem] tracking-[0.18em] uppercase hover:bg-secondary"
          >
            <LogOut size={14} strokeWidth={1.4} /> Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="bg-card p-6">
          <h1 className="font-display text-3xl">Como usar este painel</h1>
          <ol className="mt-4 space-y-2 text-sm font-light text-muted-foreground">
            <li>1. Clique em <strong>Novo produto</strong> para cadastrar um item.</li>
            <li>2. Preencha nome, descrição, preço, categoria e quantidade em estoque.</li>
            <li>3. Envie a foto do produto direto do seu computador (JPG ou PNG, até 5 MB).</li>
            <li>4. Clique em <strong>Salvar</strong>. A loja é atualizada na hora.</li>
            <li>
              5. Use o ícone do olho para <strong>ocultar</strong> um produto sem apagá-lo, e a
              lixeira para excluir de vez.
            </li>
          </ol>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-2xl">
            Produtos cadastrados ({rows.length})
          </h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-deep px-5 py-3 text-[0.65rem] tracking-[0.2em] uppercase text-deep-foreground hover:opacity-90"
          >
            <Plus size={14} strokeWidth={1.6} /> Novo produto
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && rows.length === 0 && (
            <p className="bg-card p-6 text-sm font-light text-muted-foreground">
              Nenhum produto ainda. Clique em “Novo produto” para começar.
            </p>
          )}
          {rows.map((row) => {
            const img = row.image_path ? thumbs[row.image_path] : row.image_url;
            return (
              <article
                key={row.id}
                className="flex flex-wrap items-center gap-4 bg-card p-4"
              >
                {img ? (
                  <img src={img} alt={row.name} className="h-20 w-20 object-cover" />
                ) : (
                  <div className="grid h-20 w-20 place-items-center bg-secondary text-[0.55rem] uppercase text-muted-foreground">
                    Sem foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl leading-tight">{row.name}</h3>
                  <p className="text-[0.6rem] tracking-[0.18em] uppercase text-muted-foreground">
                    {row.category} · estoque {row.stock} ·{" "}
                    {row.is_active ? "visível na loja" : "oculto"}
                  </p>
                  <p className="mt-1 text-sm font-light">{formatBRL(Number(row.price))}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Editar"
                    onClick={() => openEdit(row)}
                    className="grid h-10 w-10 place-items-center border border-border hover:bg-secondary"
                  >
                    <Pencil size={15} strokeWidth={1.4} />
                  </button>
                  <button
                    aria-label={row.is_active ? "Ocultar" : "Mostrar"}
                    onClick={() => toggleActive(row)}
                    className="grid h-10 w-10 place-items-center border border-border hover:bg-secondary"
                  >
                    {row.is_active ? (
                      <Eye size={15} strokeWidth={1.4} />
                    ) : (
                      <EyeOff size={15} strokeWidth={1.4} />
                    )}
                  </button>
                  <button
                    aria-label="Excluir"
                    onClick={() => remove(row)}
                    className="grid h-10 w-10 place-items-center border border-border text-destructive hover:bg-secondary"
                  >
                    <Trash2 size={15} strokeWidth={1.4} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-deep/50 p-4 md:p-10">
          <form
            onSubmit={save}
            className="mx-auto w-full max-w-2xl bg-background p-6 md:p-8"
          >
            <h2 className="font-display text-3xl">
              {editing ? "Editar produto" : "Novo produto"}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={label} htmlFor="name">
                  Nome do produto
                </label>
                <input
                  id="name"
                  className={field}
                  value={form.name}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex.: Batom Velours Noir"
                />
              </div>

              <div className="md:col-span-2">
                <label className={label} htmlFor="description">
                  Descrição curta
                </label>
                <textarea
                  id="description"
                  className={field}
                  rows={3}
                  maxLength={400}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ex.: Matte aveludado de longa fixação"
                />
              </div>

              <div>
                <label className={label} htmlFor="price">
                  Preço (R$)
                </label>
                <input
                  id="price"
                  className={field}
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="289,00"
                />
              </div>

              <div>
                <label className={label} htmlFor="stock">
                  Quantidade em estoque
                </label>
                <input
                  id="stock"
                  className={field}
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              <div>
                <label className={label} htmlFor="category">
                  Categoria
                </label>
                <select
                  id="category"
                  className={field}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={label} htmlFor="badge">
                  Selo (opcional)
                </label>
                <input
                  id="badge"
                  className={field}
                  maxLength={30}
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Ex.: Novo, Best-seller"
                />
              </div>

              <div className="md:col-span-2">
                <label className={label} htmlFor="product_url">
                  Link do produto (opcional)
                </label>
                <input
                  id="product_url"
                  className={field}
                  value={form.product_url}
                  onChange={(e) => setForm({ ...form, product_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className={label} htmlFor="rating">
                  Avaliação (1 a 5 estrelas)
                </label>
                <input
                  id="rating"
                  className={field}
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </div>

              <div>
                <label className={label} htmlFor="sort_order">
                  Ordem na loja (menor aparece antes)
                </label>
                <input
                  id="sort_order"
                  className={field}
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <span className={label}>Foto do produto</span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {preview ? (
                    <img src={preview} alt="Pré-visualização" className="h-28 w-28 object-cover" />
                  ) : (
                    <div className="grid h-28 w-28 place-items-center bg-secondary text-[0.55rem] uppercase text-muted-foreground">
                      Sem foto
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 border border-border px-4 py-3 text-[0.62rem] tracking-[0.18em] uppercase hover:bg-secondary">
                    <Upload size={14} strokeWidth={1.4} />
                    Escolher imagem
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs font-light text-muted-foreground">
                  JPG ou PNG de até 5 MB. Imagens quadradas ficam mais bonitas na loja.
                </p>
              </div>

              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm font-light">Mostrar este produto na loja</span>
              </label>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-deep py-4 text-[0.66rem] tracking-[0.2em] uppercase text-deep-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-border py-4 text-[0.66rem] tracking-[0.2em] uppercase hover:bg-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
