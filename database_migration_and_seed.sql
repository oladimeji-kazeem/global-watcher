-- Create Countries Table
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  flag TEXT NOT NULL,
  authority TEXT NOT NULL,
  website TEXT NOT NULL,
  tracked INTEGER NOT NULL DEFAULT 0,
  updates INTEGER NOT NULL DEFAULT 0,
  visa_types TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for countries" ON public.countries;
CREATE POLICY "Public read access for countries" ON public.countries FOR SELECT USING (true);


-- Create Immigration Changes Table
CREATE TABLE IF NOT EXISTS public.immigration_changes (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  flag TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  previous_rule TEXT NOT NULL,
  new_rule TEXT NOT NULL,
  effective_date DATE NOT NULL,
  announcement_date DATE NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  status TEXT NOT NULL,
  impact TEXT NOT NULL,
  reviewed_by TEXT NOT NULL,
  key_points TEXT[] NOT NULL DEFAULT '{}',
  analytic_descriptive TEXT,
  analytic_diagnostic TEXT,
  analytic_predictive TEXT,
  analytic_prescriptive TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.immigration_changes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for immigration changes" ON public.immigration_changes;
CREATE POLICY "Public read access for immigration changes" ON public.immigration_changes FOR SELECT USING (true);

-- Create Timelines Table
CREATE TABLE IF NOT EXISTS public.timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for timelines" ON public.timelines;
CREATE POLICY "Public read access for timelines" ON public.timelines FOR SELECT USING (true);


-- Seeding Countries
INSERT INTO public.countries (code, name, flag, authority, website, tracked, updates, visa_types) VALUES 
('UK', 'United Kingdom', '🇬🇧', 'Home Office', 'https://www.gov.uk/browse/visas-immigration', 6, 12, '{"Skilled Worker Visa", "Student Visa", "Graduate Visa", "Family Visa", "Global Talent Visa", "Settlement / ILR"}'),
('CA', 'Canada', '🇨🇦', 'IRCC', 'https://www.canada.ca/en/immigration-refugees-citizenship.html', 8, 9, '{"Express Entry", "PNP", "Study Permit", "PGWP", "Family Sponsorship", "LMIA Work Permit", "Start-up Visa", "Caregiver"}'),
('AU', 'Australia', '🇦🇺', 'Home Affairs', 'https://immi.homeaffairs.gov.au/', 5, 7, '{"Subclass 482", "Subclass 186", "Subclass 500", "Subclass 189", "Subclass 190"}'),
('DE', 'Germany', '🇩🇪', 'BAMF', 'https://www.make-it-in-germany.com/', 4, 5, '{"Blue Card EU", "Job Seeker Visa", "Skilled Worker Visa", "Student Visa"}'),
('US', 'United States', '🇺🇸', 'USCIS', 'https://www.uscis.gov/', 9, 14, '{"H-1B", "H-2B", "L-1", "O-1", "EB-1", "EB-2", "EB-3", "F-1", "Green Card"}'),
('IE', 'Ireland', '🇮🇪', 'Department of Enterprise, Trade and Employment', 'https://enterprise.gov.ie/', 35, 3, '{"General Employment Permit", "Critical Skills Employment Permit", "Working Holiday"}')
ON CONFLICT (code) DO NOTHING;


-- Seeding Immigration Changes
INSERT INTO public.immigration_changes (id, country, country_code, flag, visa_type, category, title, description, long_description, previous_rule, new_rule, effective_date, announcement_date, source_url, source_name, status, impact, reviewed_by, key_points) VALUES
('uk-sw-2026', 'United Kingdom', 'UK', '🇬🇧', 'Skilled Worker Visa', 'Employment', 'Salary threshold raised to £30,000', 'The Home Office has updated the minimum salary requirement for Skilled Worker visa sponsorship.', 'The UK Home Office has published updated Immigration Rules raising the general minimum salary requirement for Skilled Worker visa sponsorship. The change affects all new applications and sponsor licence assignments from the effective date. Existing Skilled Worker holders extending or changing employer are not immediately affected but should confirm compliance with the new going rate for their occupation code.', 'Minimum salary £26,200 per year (or going rate for the occupation).', 'Minimum salary £30,000 per year (or going rate for the occupation, whichever is higher).', '2026-09-01', '2026-07-21', 'https://www.gov.uk/skilled-worker-visa', 'Home Office', 'urgent', 'Future applicants & sponsors', 'Radar Editorial', '{"Applies to Certificates of Sponsorship assigned on or after 1 September 2026.", "Going rate percentiles for shortage occupations remain at 80%.", "No transitional arrangements announced for pending applications."}'),
('ca-ee-2026', 'Canada', 'CA', '🇨🇦', 'Express Entry', 'Permanent Residence', 'New category-based draws for healthcare', 'IRCC introduces targeted draws prioritising healthcare and STEM occupations.', 'Immigration, Refugees and Citizenship Canada (IRCC) is introducing new category-based Express Entry rounds of invitations that prioritise candidates with experience in healthcare, STEM, skilled trades, transport and agriculture. The new draws run alongside general CRS rounds and target 2026 admissions levels.', 'General Comprehensive Ranking System (CRS) draws only, held roughly every two weeks.', 'Category-based draws every two weeks, alternating with general CRS rounds.', '2026-08-15', '2026-07-18', 'https://www.canada.ca/en/immigration-refugees-citizenship.html', 'IRCC', 'approved', 'Skilled worker candidates', 'Radar Editorial', '{"Requires at least 6 months of continuous full-time work in a qualifying NOC.", "Candidates must still meet minimum CRS score cut-off for each draw.", "Language proficiency requirements unchanged."}'),
('au-482-2026', 'Australia', 'AU', '🇦🇺', 'Subclass 482', 'Employment', 'TSMIT increased to AUD 73,150', 'Temporary Skilled Migration Income Threshold updated for the new financial year.', 'The Australian Department of Home Affairs has indexed the Temporary Skilled Migration Income Threshold (TSMIT) for the 2026-27 financial year. New nominations from the effective date must meet the higher threshold, alongside the market salary rate for the occupation.', 'TSMIT AUD 70,000 per annum.', 'TSMIT AUD 73,150 per annum.', '2026-07-01', '2026-06-10', 'https://immi.homeaffairs.gov.au/', 'Department of Home Affairs', 'warning', 'Employer sponsors', 'Radar Editorial', '{"Applies to new nomination applications from 1 July 2026.", "Existing 482 holders unaffected until their next renewal.", "Market salary rate assessment still required."}'),
('de-bc-2026', 'Germany', 'DE', '🇩🇪', 'Blue Card EU', 'Employment', 'Salary threshold lowered for shortage occupations', 'Germany expands Blue Card access with lower salary bars for shortage roles.', 'Germany''s Federal Office for Migration and Refugees (BAMF) confirmed updated Blue Card EU thresholds as part of the ongoing Skilled Immigration Act reforms. The reduction is aimed at accelerating recruitment in IT, healthcare and engineering shortage occupations.', '€45,300 general threshold; €41,041 shortage occupations.', '€41,041 general; €36,672 shortage occupations.', '2026-06-01', '2026-05-20', 'https://www.make-it-in-germany.com/', 'BAMF', 'approved', 'Skilled foreign workers', 'Radar Editorial', '{"Applies to new Blue Card applications submitted from 1 June 2026.", "Recognition of foreign qualifications remains required.", "Family reunification rules unchanged."}'),
('us-h1b-2026', 'United States', 'US', '🇺🇸', 'H-1B', 'Employment', 'Registration fee increased to $215', 'USCIS raises H-1B electronic registration fee ahead of FY2027 cap season.', 'U.S. Citizenship and Immigration Services (USCIS) has finalised a rule raising the H-1B electronic registration fee. The new fee applies to all registrants participating in the FY2027 cap season.', 'Registration fee $10 per beneficiary.', 'Registration fee $215 per beneficiary.', '2026-03-01', '2026-02-02', 'https://www.uscis.gov/', 'USCIS', 'warning', 'H-1B petitioners', 'Radar Editorial', '{"Applies to the FY2027 initial registration period.", "Beneficiary-centric selection process retained.", "Filing fees for approved I-129 petitions unchanged in this update."}'),
('ie-cs-2026', 'Ireland', 'IE', '🇮🇪', 'Critical Skills Permit', 'Employment', 'Occupations list expanded', '20 new roles added to the Critical Skills Occupations List including AI engineers.', 'Ireland''s Department of Enterprise, Trade and Employment (DETE) has published its 2026 review of the employment permits occupation lists, adding new roles to the Critical Skills Occupations List.', '2024 Critical Skills Occupations List with 60 eligible roles.', '2026 list with 80 eligible roles, adding AI, cyber and healthcare positions.', '2026-07-10', '2026-07-01', 'https://enterprise.gov.ie/', 'DETE', 'info', 'Tech & healthcare workers', 'Radar Editorial', '{"Applies to new Critical Skills Employment Permit applications.", "Minimum annual remuneration criteria remain in force.", "Two-year stamp before eligibility for Stamp 4 unchanged."}'),
('uk-student-2026', 'United Kingdom', 'UK', '🇬🇧', 'Student Visa', 'Study', 'Dependant restrictions extended to research masters', 'Home Office widens dependant restrictions to include most taught research masters courses.', 'Following the January 2024 restrictions on dependants for taught masters, the Home Office is extending the restriction to selected research masters programmes. PhD candidates remain able to bring dependants.', 'Dependants restricted only for taught masters shorter than 9 months.', 'Dependants restricted for taught and non-doctoral research masters programmes.', '2026-10-01', '2026-06-15', 'https://www.gov.uk/student-visa', 'Home Office', 'urgent', 'International students', 'Radar Editorial', '{"Effective for CAS assigned from 1 October 2026.", "PhD, research doctorate and government-sponsored students exempt.", "Existing dependants can extend in line with the main applicant."}'),
('ca-pgwp-2026', 'Canada', 'CA', '🇨🇦', 'Post-Graduation Work Permit', 'Study', 'PGWP tightened to eligible field lists', 'IRCC restricts PGWP eligibility to graduates of programmes tied to labour-market shortage fields.', 'New IRCC policy limits PGWP eligibility for non-degree college programmes to those aligned with 966 designated fields of study linked to long-term labour shortages.', 'PGWP available to graduates of most eligible DLI programmes.', 'Non-degree college graduates must have studied one of 966 designated fields.', '2026-05-15', '2026-03-20', 'https://www.canada.ca/en/immigration-refugees-citizenship.html', 'IRCC', 'warning', 'International college students', 'Radar Editorial', '{"Bachelor, masters and doctoral graduates unaffected.", "Field lists reviewed annually by IRCC.", "Language testing requirement retained."}')
ON CONFLICT (id) DO NOTHING;


-- Seeding Timelines
INSERT INTO public.timelines (year, title, body) VALUES
('2023', 'Salary threshold £26,200', 'Baseline Skilled Worker minimum salary set.'),
('2024', 'Health surcharge increased', 'IHS rose from £624 to £1,035 per year.'),
('2025', 'Threshold raised to £38,700', 'Major shift for new Skilled Worker applications.'),
('2026', 'Settlement reforms proposed', 'Consultation on 10-year qualifying period underway.')
ON CONFLICT (id) DO NOTHING;


-- Fresh updates (June/July 2026)
INSERT INTO public.immigration_changes (id, country, country_code, flag, visa_type, category, title, description, long_description, previous_rule, new_rule, effective_date, announcement_date, source_url, source_name, status, impact, reviewed_by, key_points) VALUES
('uk-gt-2026', 'United Kingdom', 'UK', '🇬🇧', 'Global Talent Visa', 'Employment', 'Endorsement route simplified', 'The Tech Nation endorsement route has been fully transitioned to the new digital hub, reducing processing times.', 'The Home Office and endorsing bodies have officially rolled out the fully digital endorsement processing hub for the Global Talent Visa. Applicants now benefit from streamlined evidence submission and faster turnaround times.', 'Paper-heavy endorsement pathways taking up to 8 weeks.', '100% digital submission with average decisions in 3 weeks.', '2026-06-15', '2026-06-01', 'https://www.gov.uk/global-talent-visa', 'Home Office', 'approved', 'Highly skilled applicants', 'Radar Editorial', '{"Fully digital endorsement upload portal.", "Average wait times reduced by 5 weeks.", "No changes to eligibility criteria."}'),
('us-eb2-2026', 'United States', 'US', '🇺🇸', 'EB-2', 'Permanent Residence', 'Priority dates freeze announced', 'USCIS signals a temporary freeze on EB-2 priority date advancement due to unprecedented cap demands.', 'The State Department visa bulletin confirms that the EB-2 category will experience a stagnation in priority dates for the remainder of FY2026.', 'Priority dates advanced steadily by 2-3 weeks per month.', 'Dates held steady at May 2023 for Rest of World.', '2026-07-01', '2026-06-15', 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html', 'Department of State', 'warning', 'Employment-based applicants', 'Radar Editorial', '{"Affects adjustment of status applicants currently in the US.", "Premium processing remains available for I-140s.", "Next movement expected in October."}'),
('ca-cit-2026', 'Canada', 'CA', '🇨🇦', 'Citizenship', 'Citizenship', 'Digital oath taking expanded', 'IRCC rolls out 1-click digital oaths for new citizens.', 'IRCC has officially modernised the citizenship ceremony process by making the digital oath legally binding via the portal, bypassing the need for scheduled video ceremonies.', 'Virtual video ceremonies requiring scheduling.', 'On-demand digital signature for oath taking.', '2026-06-30', '2026-06-05', 'https://www.canada.ca/en/immigration-refugees-citizenship.html', 'IRCC', 'info', 'Citizenship applicants', 'Radar Editorial', '{"Optional for all approved candidates.", "Reduces backlog processing.", "Physical ceremonies still available on request."}'),
('au-189-2026', 'Australia', 'AU', '🇦🇺', 'Subclass 189', 'Permanent Residence', 'Points test restructured', 'Home Affairs has heavily weighted regional study and partner English skills.', 'In an effort to disperse skilled migrants, the Subclass 189 visa points test has been recalibrated. Studying in a designated regional area now awards double points, and partner English competency is heavily incentivised.', 'Regional study: 5 points. Partner English: 5 points.', 'Regional study: 10 points. Partner English: 10 points.', '2026-07-15', '2026-06-25', 'https://immi.homeaffairs.gov.au/', 'Home Affairs', 'warning', 'Skilled independent candidates', 'Radar Editorial', '{"Grandfathering provisions apply to existing EOIs.", "Maximum points remain capped.", "Designed to alleviate metropolitan housing stress."}'),
('de-chk-2026', 'Germany', 'DE', '🇩🇪', 'Job Seeker Visa', 'Employment', 'Chancenkarte portal launch', 'The fully digital Opportunity Card portal goes live globally.', 'Following its legislative launch, the fully integrated digital portal for the Chancenkarte (Opportunity Card) is now accessible, allowing applicants to calculate points and apply entirely online.', 'Paper applications at local consulates.', 'Digital portal with integrated points calculator.', '2026-06-05', '2026-06-01', 'https://www.make-it-in-germany.com/', 'BAMF', 'approved', 'Job seekers', 'Radar Editorial', '{"Instant pre-approval certificates available.", "Integrated with Federal Employment Agency database.", "Streamlines consulate processing."}'),
('ie-gep-2026', 'Ireland', 'IE', '🇮🇪', 'General Employment Permit', 'Employment', 'Processing times halved', 'DETE clearing backlogs with new automated triage system.', 'The Department of Enterprise, Trade and Employment has successfully deployed an automated triage system that has effectively halved the processing times for standard General Employment Permits.', 'Processing times averaging 12 weeks.', 'Processing times averaging 6 weeks.', '2026-07-10', '2026-06-20', 'https://enterprise.gov.ie/', 'DETE', 'approved', 'Irish employers & foreign workers', 'Radar Editorial', '{"Standard applicants heavily benefit.", "Trusted Partner wait times reduced to 2 weeks.", "Applies immediately to pending applications."}')
ON CONFLICT (id) DO NOTHING;


-- Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for admin_users" ON public.admin_users;
CREATE POLICY "Public read access for admin_users" ON public.admin_users FOR SELECT USING (true);

-- Create Watchlists Table
CREATE TABLE IF NOT EXISTS public.watchlists (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  visa_types TEXT[] NOT NULL DEFAULT '{}',
  statuses TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own watchlists" ON public.watchlists;
CREATE POLICY "Users can manage their own watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);

-- Create Analytics Page Views Table
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Insert admin users
INSERT INTO public.admin_users (email) VALUES 
('olakazeem@outlook.com'),
('olakazeem@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Schema additions for Analytics
ALTER TABLE public.immigration_changes ADD COLUMN IF NOT EXISTS analytic_descriptive TEXT;
ALTER TABLE public.immigration_changes ADD COLUMN IF NOT EXISTS analytic_diagnostic TEXT;
ALTER TABLE public.immigration_changes ADD COLUMN IF NOT EXISTS analytic_predictive TEXT;
ALTER TABLE public.immigration_changes ADD COLUMN IF NOT EXISTS analytic_prescriptive TEXT;

