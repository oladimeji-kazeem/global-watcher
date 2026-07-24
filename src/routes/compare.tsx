import { createFileRoute } from '@tanstack/react-router'
import { AppSidebarLayout, PageHeader } from '@/components/site-shell'
import { useState } from 'react';
import { Scale, CheckCircle2, XCircle, ArrowRight, TrendingUp, Clock, Landmark } from 'lucide-react';

export const Route = createFileRoute('/compare')({
  component: ComparisonSimulatorPage,
})

const COUNTRY_PROFILES: Record<string, any> = {
  'ca': {
    name: 'Canada (Express Entry)',
    flag: '🇨🇦',
    pathway: 'Points-based Federal Skilled Worker',
    costScore: 'High ($$$)',
    timeline: '6 to 12 months (Draw dependent)',
    prPath: 'Direct to PR on arrival',
    market: 'High tech & healthcare demand',
    friction: 'Extremely high CRS cut-offs recently.',
    pros: ['Direct Permanent Residency', 'Universal healthcare access immediately', 'Broad provincial pathways'],
    cons: ['High proof of funds required', 'Fierce global pool competition', 'Housing crisis impacting rent']
  },
  'gb': {
    name: 'United Kingdom (Skilled Worker)',
    flag: '🇬🇧',
    pathway: 'Employer-Sponsored Route',
    costScore: 'Very High ($$$$)',
    timeline: '3 to 6 weeks (If sponsored)',
    prPath: 'Eligible for ILR after 5 years',
    market: 'Shortages in engineering & finance',
    friction: 'Minimum salary threshold leaped to £38,700.',
    pros: ['Fast processing timeline', 'No absolute point cut-offs (if sponsored)', 'High tier global city access'],
    cons: ['Tied strictly to employer sponsorship', 'Massive NHS health surcharges', 'Extremely high barrier to entry for junior roles']
  },
  'us': {
    name: 'United States (H-1B)',
    flag: '🇺🇸',
    pathway: 'Employer-Sponsored Lottery',
    costScore: 'High ($$$)',
    timeline: '3 to 8 months (Lottery dependent)',
    prPath: 'Significant Green Card backlogs',
    market: 'Dominated by Big Tech & STEM',
    friction: 'Strict 85,000 annual quota lottery system.',
    pros: ['Unmatched global compensation packages', 'Status and prestige of US job market', 'Spouse can work (Under specific conditions)'],
    cons: ['Fundamentally a lottery—no absolute guarantees', 'Green Card path can take decades depending on nationality', 'Loss of job means 60 days to leave the country']
  },
  'au': {
    name: 'Australia (Subclass 189/190)',
    flag: '🇦🇺',
    pathway: 'State/Federal Nominated Points',
    costScore: 'High ($$$)',
    timeline: '12 to 18 months',
    prPath: 'Direct to PR on arrival',
    market: 'Desperate trades and medical shortages',
    friction: 'Strict state occupation list requirements.',
    pros: ['Direct Permanent Residency', 'Highest minimum wages globally', 'Excellent work-life balance & climate'],
    cons: ['Longest processing times', 'Extremely strict English tests (PTE/IELTS)', 'State nomination quotas fill fast']
  },
  'de': {
    name: 'Germany (Blue Card EU)',
    flag: '🇩🇪',
    pathway: 'Employer-Sponsored Talent Route',
    costScore: 'Moderate ($$)',
    timeline: '2 to 4 months',
    prPath: 'PR possible in 21-33 months',
    market: 'Massive engineering/IT gaps',
    friction: 'Bureaucracy and language barriers.',
    pros: ['Lowest base salary thresholds for tech', 'Fastest track to citizenship (New laws)', 'Access to entire Schengen area'],
    cons: ['German language barrier for daily life', 'Extensive paper-based bureaucracy', 'High taxation rates']
  }
}

function ComparisonSimulatorPage() {
  const [leftCountry, setLeftCountry] = useState('ca');
  const [rightCountry, setRightCountry] = useState('us');

  const left = COUNTRY_PROFILES[leftCountry];
  const right = COUNTRY_PROFILES[rightCountry];

  const generateScore = (param: string) => {
    // Mocked logic for visual comparison bars
    return Math.floor(Math.random() * 40) + 60; // 60-100 range
  }

  return (
    <AppSidebarLayout>
      <main>
        <PageHeader
          eyebrow="What-If Planning"
          title="Micro-Simulator Engine"
          description="Run a side-by-side comparative analysis of immigration pathways, friction points, and hidden costs to determine the optimal strategic vector."
        />

        <div className="mx-auto max-w-7xl px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Selectors */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#2DA099]">Vector Alpha (Left)</label>
              <select value={leftCountry} onChange={e => setLeftCountry(e.target.value)} className="w-full bg-card/60 backdrop-blur-md border border-[color:var(--primary)]/30 rounded-xl p-4 text-white font-medium focus:border-[color:var(--primary)] outline-none transition shadow-[0_0_15px_rgba(45,160,153,0.1)]">
                {Object.entries(COUNTRY_PROFILES).map(([key, val]) => (
                  <option key={key} value={key}>{val.flag} {val.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-blue-400">Vector Beta (Right)</label>
              <select value={rightCountry} onChange={e => setRightCountry(e.target.value)} className="w-full bg-card/60 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 text-white font-medium focus:border-blue-500/50 outline-none transition shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                {Object.entries(COUNTRY_PROFILES).map(([key, val]) => (
                  <option key={key} value={key}>{val.flag} {val.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Panel */}
          <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-y-0 left-1/2 w-px bg-border/40 hidden md:block" />

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">

              {/* Left Column */}
              <div className="p-8 space-y-10 group">
                <div className="text-center space-y-3">
                  <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{left.flag}</div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">{left.name}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)] border border-[color:var(--primary)]/30 text-xs font-semibold uppercase tracking-widest">
                    {left.pathway}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-black/20 p-4 rounded-xl border border-border/50">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Timeline</div>
                      <div className="text-sm font-semibold text-white">{left.timeline}</div>
                    </div>
                    <div className="space-y-1 bg-black/20 p-4 rounded-xl border border-border/50">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Landmark className="h-3 w-3" /> Entry Cost</div>
                      <div className="text-sm font-semibold text-white">{left.costScore}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-white border-b border-border/50 pb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[color:var(--success)]" /> Strategic Advantages
                    </h3>
                    <ul className="space-y-3">
                      {left.pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-[color:var(--success)] shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-white border-b border-border/50 pb-2 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber-500" /> Friction & Risks
                    </h3>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200/80 mb-4">
                      {left.friction}
                    </div>
                    <ul className="space-y-3">
                      {left.cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                          <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="p-8 space-y-10 group">
                <div className="text-center space-y-3">
                  <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{right.flag}</div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">{right.name}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-widest">
                    {right.pathway}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-black/20 p-4 rounded-xl border border-border/50">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Timeline</div>
                      <div className="text-sm font-semibold text-white">{right.timeline}</div>
                    </div>
                    <div className="space-y-1 bg-black/20 p-4 rounded-xl border border-border/50">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Landmark className="h-3 w-3" /> Entry Cost</div>
                      <div className="text-sm font-semibold text-white">{right.costScore}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-white border-b border-border/50 pb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" /> Strategic Advantages
                    </h3>
                    <ul className="space-y-3">
                      {right.pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-white border-b border-border/50 pb-2 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber-500" /> Friction & Risks
                    </h3>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200/80 mb-4">
                      {right.friction}
                    </div>
                    <ul className="space-y-3">
                      {right.cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                          <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 bg-black/30 border-t border-border/40 text-center flex flex-col items-center justify-center">
              <div className="text-xs uppercase tracking-widest text-[color:var(--primary)] font-bold mb-2">Final Vector Output</div>
              <div className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Based on current macroscopic trends, {leftCountry === rightCountry ? "you are comparing identical jurisdictions." : `choosing ${left.name.split(' (')[0]} offers a ${left.pathway.toLowerCase()} approach, while ${right.name.split(' (')[0]} relies on a ${right.pathway.toLowerCase()} mechanic. Assess your liquidity and timeline tolerance before initiating.`}
              </div>
            </div>
          </div>

        </div>
      </main>
    </AppSidebarLayout>
  )
}
