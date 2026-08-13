CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Usuarios veem seus proprios papeis"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Primeiro usuario cadastrado vira administrador
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'Maquiagem',
  image_url text,
  image_path text,
  stock integer NOT NULL DEFAULT 0,
  product_url text,
  badge text,
  rating integer NOT NULL DEFAULT 5,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Loja mostra produtos ativos"
ON public.products FOR SELECT TO anon
USING (is_active = true);

CREATE POLICY "Admins veem todos os produtos"
ON public.products FOR SELECT TO authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins criam produtos"
ON public.products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins editam produtos"
ON public.products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins excluem produtos"
ON public.products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Imagens dos produtos
CREATE POLICY "Admins enviam imagens de produtos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins leem imagens de produtos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam imagens de produtos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins apagam imagens de produtos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.products (name, description, price, category, badge, rating, sort_order, stock) VALUES
('Batom Velours Noir', 'Matte aveludado de longa fixação', 289, 'Maquiagem', 'Best-seller', 5, 1, 25),
('Sérum Éclat d''Or', 'Vitamina C estabilizada e ácido hialurônico', 486, 'Skincare', 'Novo', 5, 2, 18),
('Parfum Nuit Blanche', 'Âmbar, jasmim e baunilha bourbon', 749, 'Perfumes', NULL, 4, 3, 12),
('Creme Riche Absolu', 'Nutrição intensa com peptídeos', 592, 'Corpo e Banho', NULL, 5, 4, 20),
('Óleo Capilar Soie', 'Brilho espelhado sem peso', 234, 'Cabelos', NULL, 4, 5, 30),
('Paleta Terre Nue', 'Seis tons neutros ultra pigmentados', 398, 'Kits e Presentes', 'Edição limitada', 5, 6, 10);