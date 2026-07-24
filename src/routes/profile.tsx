import { createFileRoute } from "@tanstack/react-router";
import { AppSidebarLayout, PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/profile")({
    component: ProfilePage,
});

function ProfilePage() {
    return (
        <AppSidebarLayout>
            <main>
                <PageHeader
                    eyebrow="My Account"
                    title={<>Manage your <span className="text-gradient">Profile</span></>}
                    description="View your saved configurations, authentication methods, and notification preferences."
                />
                <div className="mx-auto max-w-7xl px-6 pb-24">
                    <div className="rounded-2xl border border-border bg-background/50 p-12 text-center text-muted-foreground">
                        A comprehensive profile management dashboard is coming soon.
                    </div>
                </div>
            </main>
        </AppSidebarLayout>
    );
}
