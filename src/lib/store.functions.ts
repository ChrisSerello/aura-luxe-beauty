import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Product } from "@/components/store/products";

export const listStoreProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("products")
      .select(
        "id, name, description, price, category, image_url, image_path, stock, product_url, badge, rating",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const paths = rows.map((r) => r.image_path).filter((p): p is string => !!p);
    const signed: Record<string, string> = {};

    if (paths.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: urls } = await supabaseAdmin.storage
        .from("produtos")
        .createSignedUrls(paths, 60 * 60 * 24 * 7);
      for (const u of urls ?? []) {
        if (u.path && u.signedUrl) signed[u.path] = u.signedUrl;
      }
    }

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      category: r.category,
      imageUrl: (r.image_path ? signed[r.image_path] : null) ?? r.image_url ?? null,
      stock: r.stock,
      productUrl: r.product_url,
      badge: r.badge,
      rating: r.rating,
    }));
  },
);
