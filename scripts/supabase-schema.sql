-- AMG Décoration d'Intérieur — Schéma Supabase
-- À exécuter dans l'éditeur SQL de Supabase (app.supabase.com)

-- ─── Projets / Réalisations ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('salon','chambre','cuisine','terrasse','bureau','autre')),
  room_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Prestations / Services ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  includes TEXT[] DEFAULT '{}',
  offers JSONB NOT NULL DEFAULT '[]',
  image TEXT,
  note TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ─── Témoignages ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT
);

-- ─── Posts Instagram ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  link TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ─── Contenu éditable ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Créer le bucket "media" dans Storage > Buckets > New bucket
-- Cocher "Public bucket"

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Activer RLS sur toutes les tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read instagram_posts" ON instagram_posts FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);

-- Écriture uniquement pour les utilisateurs authentifiés
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write instagram_posts" ON instagram_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
