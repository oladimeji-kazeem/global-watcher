import { supabase } from "@/integrations/supabase/client";

export type ChangeStatus = "urgent" | "warning" | "approved" | "info";

export interface ImmigrationChange {
    id: string;
    country: string;
    country_code: string;
    flag: string;
    visa_type: string;
    category: string;
    title: string;
    description: string;
    long_description: string;
    previous_rule: string;
    new_rule: string;
    effective_date: string;
    announcement_date: string;
    source_url: string;
    source_name: string;
    status: ChangeStatus;
    impact: string;
    reviewed_by: string;
    key_points: string[];
    analytic_descriptive?: string;
    analytic_diagnostic?: string;
    analytic_predictive?: string;
    analytic_prescriptive?: string;
}

export interface Country {
    code: string;
    name: string;
    flag: string;
    authority: string;
    website: string;
    tracked: number;
    updates: number;
    visa_types: string[];
}

export interface TimelineEvent {
    year: string;
    title: string;
    body: string;
}

export async function fetchChanges(): Promise<ImmigrationChange[]> {
    const { data, error } = await (supabase as any).from("immigration_changes").select("*").order("effective_date", { ascending: false });
    if (error) {
        console.error("Error fetching immigration changes:", error);
        return [];
    }
    return data as ImmigrationChange[];
}

export async function fetchChangeById(id: string): Promise<ImmigrationChange | null> {
    const { data, error } = await (supabase as any).from("immigration_changes").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching immigration change:", error);
        return null;
    }
    return data as ImmigrationChange;
}

export async function fetchCountries(): Promise<Country[]> {
    const { data, error } = await (supabase as any).from("countries").select("*").order("name", { ascending: true });
    if (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
    return data as Country[];
}

export async function fetchTimeline(): Promise<TimelineEvent[]> {
    const { data, error } = await (supabase as any).from("timelines").select("*").order("year", { ascending: true });
    if (error) {
        console.error("Error fetching timelines:", error);
        return [];
    }
    return data as TimelineEvent[];
}

export const statusStyles: Record<ChangeStatus, { label: string; dot: string; badge: string }> = {
    urgent: { label: "Urgent", dot: "bg-[color:var(--danger)]", badge: "bg-[color:var(--danger)]/15 text-[color:var(--danger)] border-[color:var(--danger)]/30" },
    warning: { label: "Warning", dot: "bg-[color:var(--warning)]", badge: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30" },
    approved: { label: "Approved", dot: "bg-[color:var(--success)]", badge: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30" },
    info: { label: "Info", dot: "bg-[color:var(--info)]", badge: "bg-[color:var(--info)]/15 text-[color:var(--info)] border-[color:var(--info)]/30" },
};

export function formatDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function getFilterOptions() {
    const changes = await fetchChanges();
    const allCategories = Array.from(new Set(changes.map(c => c.category)));
    const allVisaTypes = Array.from(new Set(changes.map(c => c.visa_type)));
    const allCountries = Array.from(new Set(changes.map(c => c.country)));
    const allStatuses: ChangeStatus[] = ["urgent", "warning", "approved", "info"];

    return {
        categories: allCategories,
        visaTypes: allVisaTypes,
        countries: allCountries,
        statuses: allStatuses
    };
}
