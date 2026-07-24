import { createFileRoute } from '@tanstack/react-router'
import { AppSidebarLayout, PageHeader } from '@/components/site-shell'
import { useState } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, ArrowLeft, Target, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/eligibility')({
    component: EligibilityPredictorPage,
})

function EligibilityPredictorPage() {
    const [step, setStep] = useState(1);
    const [calculating, setCalculating] = useState(false);

    const [data, setData] = useState({
        age: 28,
        profession: 'Software Engineer',
        english: 'Advanced (IELTS 7.5+)',
        destination: 'Canada',
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const startCalculation = () => {
        setStep(4);
        setCalculating(true);
        setTimeout(() => setCalculating(false), 2500);
    }

    const getResult = () => {
        if (data.destination === 'Canada') {
            return {
                score: 82,
                status: 'Highly Viable',
                color: 'text-green-400',
                bg: 'bg-green-400/10 border-green-400/20',
                recommendation: 'Express Entry (Federal Skilled Worker)',
                notes: 'Your age and advanced English proficiency maximize your CRS score. Software Engineering is currently heavily targeted in category-based draws.'
            }
        }
        if (data.destination === 'United Kingdom') {
            return {
                score: 65,
                status: 'Viable with Sponsorship',
                color: 'text-[color:var(--primary)]',
                bg: 'bg-[color:var(--primary)]/10 border-[color:var(--primary)]/20',
                recommendation: 'Skilled Worker Visa / Global Talent',
                notes: 'You must secure a job offer from an approved sponsor meeting the £38,700 benchmark, or seek Global Talent endorsement via Tech Nation guidelines.'
            }
        }
        return {
            score: 55,
            status: 'Moderate Friction',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10 border-amber-400/20',
            recommendation: 'Subclass 190 / H1-B Route',
            notes: 'Requires state nomination or competitive lottery selection. Advised to consult with a registered migration agent for strategic planning.'
        }
    }

    const { score, status, color, bg, recommendation, notes } = getResult();

    return (
        <AppSidebarLayout>
            <main>
                <PageHeader
                    eyebrow="AI-Powered Intelligence"
                    title="Eligibility Predictor"
                    description="Simulate your viability across the world's most competitive immigration frameworks based on active policies."
                />

                <div className="mx-auto max-w-3xl px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden relative min-h-[400px] flex flex-col">

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-border/40">
                            <div className="h-full bg-[color:var(--primary)] transition-all duration-500 ease-out glow-cyan" style={{ width: `${(step / 4) * 100}%` }} />
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-center">

                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Step 1 of 3: Core Profile
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">Let's build your baseline profile.</h2>

                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">What is your current age?</label>
                                            <div className="flex items-center gap-4">
                                                <input type="range" min="18" max="65" value={data.age} onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })} className="flex-1 accent-[color:var(--primary)]" />
                                                <span className="w-12 text-center font-semibold text-white bg-white/5 py-1.5 rounded-lg border border-border/50">{data.age}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Highest Level of Education</label>
                                            <select className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-sm text-foreground focus:border-[color:var(--primary)] transition outline-none">
                                                <option>Bachelors Degree</option>
                                                <option>Masters Degree</option>
                                                <option>Doctorate (PhD)</option>
                                                <option>High School / Diploma</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Step 2 of 3: Professional Vector
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">What is your primary occupation?</h2>

                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Occupation / Industry</label>
                                            <select value={data.profession} onChange={e => setData({ ...data, profession: e.target.value })} className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-sm text-foreground focus:border-[color:var(--primary)] transition outline-none">
                                                <option>Software Engineer</option>
                                                <option>Medical Practitioner</option>
                                                <option>Registered Nurse</option>
                                                <option>Finance Manager</option>
                                                <option>Marketing Specialist</option>
                                                <option>Trades Professional</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">English Language Proficiency</label>
                                            <select value={data.english} onChange={e => setData({ ...data, english: e.target.value })} className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-sm text-foreground focus:border-[color:var(--primary)] transition outline-none">
                                                <option>Advanced (IELTS 7.5+)</option>
                                                <option>Competent (IELTS 6.0)</option>
                                                <option>Basic / No Test Taken</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Step 3 of 3: Target Jurisdiction
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">Where are you planning to relocate?</h2>

                                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                                        {['Canada', 'United Kingdom', 'Australia', 'United States'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setData({ ...data, destination: c })}
                                                className={`p-4 rounded-xl border flex items-center justify-between transition ${data.destination === c ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-white shadow-[0_0_15px_rgba(45,160,153,0.1)]' : 'border-border/50 bg-background/30 hover:bg-white/5 text-muted-foreground'}`}
                                            >
                                                <span className="font-medium text-sm">{c}</span>
                                                {data.destination === c && <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col h-full">
                                    {calculating ? (
                                        <div className="flex flex-col items-center justify-center flex-1 space-y-6 py-12">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[color:var(--primary)]/20 blur-xl rounded-full" />
                                                <BrainCircuit className="h-16 w-16 text-[color:var(--primary)] animate-pulse relative z-10" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-lg font-semibold text-white">Analyzing Policy Metrics...</h3>
                                                <p className="text-sm text-muted-foreground mt-2 max-w-sm">Cross-referencing your profile against the latest shortage lists and point-based immigration systems.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${bg} ${color} mb-4`}>
                                                    <Target className="h-3 w-3" /> {status}
                                                </div>
                                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Viability Score: <span className={color}>{score}</span><span className="text-muted-foreground text-lg">/100</span></h2>
                                                <p className="text-muted-foreground text-sm max-w-md mx-auto">{notes}</p>
                                            </div>

                                            <div className="rounded-xl border border-border/50 bg-background/50 p-6 flex flex-col md:flex-row items-center gap-6">
                                                <div className="h-14 w-14 rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)] flex items-center justify-center shrink-0 border border-[color:var(--primary)]/20">
                                                    <GraduationCap className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Recommended Pathway</div>
                                                    <div className="text-xl font-semibold text-white">{recommendation}</div>
                                                </div>
                                                <button className="px-5 py-2.5 rounded-lg bg-hero-gradient text-white text-sm font-semibold shrink-0 glow-cyan hover:opacity-90 transition">
                                                    View Requirements
                                                </button>
                                            </div>

                                            <div className="flex justify-center">
                                                <button onClick={() => setStep(1)} className="text-xs font-semibold text-muted-foreground hover:text-white transition flex items-center gap-1">
                                                    Retake Simulation
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Footer Controls */}
                        {step < 4 && (
                            <div className="p-6 border-t border-border/50 bg-black/20 flex items-center justify-between">
                                <button
                                    onClick={handleBack}
                                    disabled={step === 1}
                                    className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </button>

                                {step < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-5 py-2.5 text-sm font-semibold text-white bg-foreground/10 hover:bg-foreground/20 rounded-lg transition flex items-center gap-2"
                                    >
                                        Continue <ArrowRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={startCalculation}
                                        className="px-5 py-2.5 text-sm font-semibold text-white bg-hero-gradient glow-cyan hover:opacity-90 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Sparkles className="h-4 w-4" /> Generate Prediction
                                    </button>
                                )}
                            </div>
                        )}

                    </div>

                </div>
            </main>
        </AppSidebarLayout>
    )
}
