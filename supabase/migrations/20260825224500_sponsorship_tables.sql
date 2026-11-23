CREATE TABLE IF NOT EXISTS public.sponsor_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  website_url TEXT,
  industry TEXT,
  sponsor_status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsor_organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for sponsor_organizations" ON public.sponsor_organizations;
CREATE POLICY "Public read access for sponsor_organizations" ON public.sponsor_organizations FOR SELECT USING (true);


CREATE TABLE IF NOT EXISTS public.sponsored_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location_city TEXT,
  job_type TEXT,
  requirements TEXT,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsored_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for sponsored_jobs" ON public.sponsored_jobs;
CREATE POLICY "Public read access for sponsored_jobs" ON public.sponsored_jobs FOR SELECT USING (true);
