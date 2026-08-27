import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const title = "Entrar no painel — Maison Lumière";
const description = "Acesso restrito à equipe responsável pela gestão da loja Maison Lumière.";

export const Route = createFileRoute("/auth")({
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
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Digite um e-mail válido." }).max(255),
  password: z
    .string()
    .min(6, { message: "A senha precisa ter pelo menos 6 caracteres." })
    .max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Bem-vinda de volta!");
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada com sucesso!");
          navigate({ to: "/admin", replace: true });
        } else {
          toast.success("Conta criada! Confirme o e-mail para entrar.");
          setMode("login");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível continuar.";
      setError(
        message.includes("Invalid login credentials")
          ? "E-mail ou senha incorretos."
          : message.includes("already registered")
            ? "Este e-mail já tem conta. Use a opção Entrar."
            : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center">
          <span className="font-display text-2xl tracking-[0.32em]">LUMIÈRE</span>
          <span className="eyebrow mt-2 block text-[0.55rem]">Painel de gestão</span>
        </Link>

        <div className="mt-10 bg-card p-8 shadow-[var(--shadow-soft)]">
          <h1 className="font-display text-3xl">
            {mode === "login" ? "Entrar no painel" : "Criar acesso"}
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            {mode === "login"
              ? "Use o e-mail e a senha cadastrados para gerenciar os produtos da loja."
              : "Crie o acesso da pessoa responsável pela loja. O primeiro cadastro vira administrador."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="eyebrow block text-[0.6rem]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-deep"
              />
            </div>
            <div>
              <label htmlFor="password" className="eyebrow block text-[0.6rem]">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-deep"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep py-4 text-[0.68rem] tracking-[0.22em] uppercase text-deep-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar acesso"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            className="mt-6 w-full text-center text-xs tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "login" ? "Ainda não tenho acesso" : "Já tenho acesso — entrar"}
          </button>
        </div>

        <Link
          to="/"
          className="mt-8 block text-center text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
