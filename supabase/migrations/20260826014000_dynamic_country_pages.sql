-- 1. Add slug to countries
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Populate slug for existing countries
UPDATE public.countries SET slug = LOWER(REPLACE(name, ' ', '-'));

-- Make slug NOT NULL after populating
ALTER TABLE public.countries ALTER COLUMN slug SET NOT NULL;

-- 2. Add slug to sponsor_organizations
ALTER TABLE public.sponsor_organizations ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Populate slug for existing sponsors (if any, safe fallback)
UPDATE public.sponsor_organizations SET slug = LOWER(REPLACE(name, ' ', '-')) || '-' || SUBSTRING(id::text, 1, 4);

-- Make slug NOT NULL after populating
ALTER TABLE public.sponsor_organizations ALTER COLUMN slug SET NOT NULL;

-- 3. Create country_pages table
CREATE TABLE IF NOT EXISTS public.country_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_code, slug)
);

ALTER TABLE public.country_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for country_pages" ON public.country_pages;
CREATE POLICY "Public read access for country_pages" ON public.country_pages FOR SELECT USING (is_published = true);
