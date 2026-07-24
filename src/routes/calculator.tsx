import { createFileRoute } from '@tanstack/react-router'
import { AppSidebarLayout, PageHeader } from '@/components/site-shell'
import { useState } from 'react';
import { Calculator, Globe2, Users, Banknote, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/calculator')({
    component: CostSimulatorPage,
})

const MOCK_FEES: Record<string, { appFee: number, healthSurcharge: number, poF: number }> = {
    'gb': { appFee: 719, healthSurcharge: 1035, poF: 1270 }, // GBP
    'ca': { appFee: 1365, healthSurcharge: 0, poF: 13757 }, // CAD
    'au': { appFee: 4640, healthSurcharge: 0, poF: 5000 }, // AUD
}

const EXCHANGE_RATES: Record<string, { rate: number, symbol: string }> = {
    'gb': { rate: 1.27, symbol: '£' }, // to USD approx
    'ca': { rate: 0.74, symbol: '$' },
    'au': { rate: 0.65, symbol: '$' },
}

function CostSimulatorPage() {
    const [country, setCountry] = useState('gb');
    const [duration, setDuration] = useState(3); // years
    const [dependants, setDependants] = useState(0);

    const fees = MOCK_FEES[country];
    const ex = EXCHANGE_RATES[country];

    const familySize = 1 + dependants;

    // Calculations in local currency
    const totalAppFee = fees.appFee * familySize;
    const totalHealthSurcharge = (fees.healthSurcharge * duration) * familySize;
    // PoF usually requires fixed amount for main + extra for dependants (mocking as generic multiplication for sim)
    const extraPofPerDependant = fees.poF * 0.3;
    const totalPoF = fees.poF + (extraPofPerDependant * dependants);
    const flightEstimate = 800 * familySize * (1 / ex.rate); // Fixed 800 USD converted to local

    const totalCostLocal = totalAppFee + totalHealthSurcharge + totalPoF + flightEstimate;
    const totalCostUSD = totalCostLocal * ex.rate;

    return (
        <AppSidebarLayout>
            <main>
                <PageHeader
                    eyebrow="Financial Intelligence"
                    title="Global Cost Simulator"
                    description="Calculate the true cost of relocation including hidden fees, health surcharges, and required proof of funds."
                />

                <div className="mx-auto max-w-5xl px-6 pb-24 grid md:grid-cols-[1fr_1.5fr] gap-8 animate-in fade-in duration-500">

                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                            <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
                                <Calculator className="h-4 w-4 text-[color:var(--primary)]" /> Parameters
                            </h3>

                            <div className="space-y-5 flex flex-col">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Globe2 className="h-3 w-3" /> Destination
                                    </label>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm text-foreground focus:border-[color:var(--primary)] outline-none"
                                    >
                                        <option value="gb">United Kingdom (Skilled Worker)</option>
                                        <option value="ca">Canada (Express Entry)</option>
                                        <option value="au">Australia (Subclass 482)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Users className="h-3 w-3" /> Dependants
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range" min="0" max="5" value={dependants}
                                            onChange={(e) => setDependants(parseInt(e.target.value))}
                                            className="flex-1 accent-[color:var(--primary)]"
                                        />
                                        <span className="w-8 text-center text-sm font-bold text-white bg-white/5 py-1 rounded-md border border-border/50">{dependants}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Spouse and children joining you.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Visa Duration (Years)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range" min="1" max="5" value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value))}
                                            className="flex-1 accent-[color:var(--primary)]"
                                        />
                                        <span className="w-8 text-center text-sm font-bold text-white bg-white/5 py-1 rounded-md border border-border/50">{duration}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Impacts cumulative health surcharges.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-sm text-amber-200">
                            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
                            <div>
                                <span className="font-semibold block mb-1 text-amber-400">Disclaimer</span>
                                This simulator provides estimates based on current standard path rules. Actual costs can vary due to biometrics, medical tests, and specific occupation exemptions.
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4 flex flex-col">
                        <div className="rounded-2xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/5 backdrop-blur-md p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Banknote className="h-32 w-32" /></div>
                            <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--primary)] mb-2">Estimated Total Capital Required</div>
                            <div className="text-5xl md:text-6xl font-display font-semibold text-white tracking-tighter glow-cyan">
                                ${totalCostUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xl text-muted-foreground font-medium">USD</span>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground mt-3">
                                Approx. {ex.symbol}{totalCostLocal.toLocaleString(undefined, { maximumFractionDigits: 0 })} Local Currency
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                            <div className="p-4 border-b border-white/5 text-sm font-semibold text-white">Cost Breakdown Definition</div>
                            <div className="divide-y divide-white/5 text-sm">
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition">
                                    <div>
                                        <div className="font-medium text-white mb-0.5">Application Fees</div>
                                        <div className="text-xs text-muted-foreground">Standard processing fee × {familySize} people</div>
                                    </div>
                                    <div className="font-semibold">{ex.symbol}{totalAppFee.toLocaleString()}</div>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition">
                                    <div>
                                        <div className="font-medium text-white mb-0.5">Immigration Health Surcharge</div>
                                        <div className="text-xs text-muted-foreground">{duration} years coverage × {familySize} people</div>
                                    </div>
                                    <div className="font-semibold">{ex.symbol}{totalHealthSurcharge.toLocaleString()}</div>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition">
                                    <div>
                                        <div className="font-medium text-white mb-0.5">Proof of Funds (Mandatory)</div>
                                        <div className="text-xs text-muted-foreground">Liquid cash required in bank accounts</div>
                                    </div>
                                    <div className="font-semibold">{ex.symbol}{totalPoF.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition">
                                    <div>
                                        <div className="font-medium text-white mb-0.5">Relocation Buffer</div>
                                        <div className="text-xs text-muted-foreground">Estimated flights & immediate landing costs</div>
                                    </div>
                                    <div className="font-semibold">{ex.symbol}{flightEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </AppSidebarLayout>
    )
}
