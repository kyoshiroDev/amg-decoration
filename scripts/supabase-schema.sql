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

-- ─── Prestations ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image TEXT,
  note TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ce qui est inclus dans la prestation (liste dynamique)
CREATE TABLE IF NOT EXISTS service_includes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lignes de tarification (une ou plusieurs par prestation)
CREATE TABLE IF NOT EXISTS service_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Avis clients ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS avis_client (
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

-- ─── Index ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_service_includes_service_id ON service_includes(service_id);
CREATE INDEX IF NOT EXISTS idx_service_prices_service_id ON service_prices(service_id);

-- ─── Trigger updated_at sur services ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Créer le bucket "media" dans Storage > Buckets > New bucket
-- Cocher "Public bucket"

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Public read projects"         ON projects         FOR SELECT USING (true);
CREATE POLICY "Public read services"         ON services         FOR SELECT USING (true);
CREATE POLICY "Public read service_includes" ON service_includes FOR SELECT USING (true);
CREATE POLICY "Public read service_prices"   ON service_prices   FOR SELECT USING (true);
CREATE POLICY "Public read avis_client"      ON avis_client      FOR SELECT USING (true);
CREATE POLICY "Public read instagram_posts"  ON instagram_posts  FOR SELECT USING (true);
CREATE POLICY "Public read site_content"     ON site_content     FOR SELECT USING (true);

-- Écriture uniquement pour les utilisateurs authentifiés
CREATE POLICY "Auth write projects"         ON projects         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write services"         ON services         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write service_includes" ON service_includes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write service_prices"   ON service_prices   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write avis_client"      ON avis_client      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write instagram_posts"  ON instagram_posts  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_content"     ON site_content     FOR ALL USING (auth.role() = 'authenticated');
