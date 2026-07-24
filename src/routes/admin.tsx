import { createFileRoute, Outlet, Link, useLocation, redirect } from '@tanstack/react-router'
import { LayoutDashboard, Database, ShieldAlert, ArrowLeft, Users } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== "olakazeem@outlook.com") {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="bg-background">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-background">

        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-border/40 bg-card/10 backdrop-blur-md p-6 flex flex-col gap-8 shrink-0">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)] mb-6 flex items-center gap-2 uppercase">
              <ShieldAlert className="h-3 w-3" /> Command Center
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                to="/admin"
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition group relative overflow-hidden ${pathname === '/admin' ? 'bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-[color:var(--primary)]/30 glow-cyan' : 'border-transparent text-muted-foreground hover:bg-white/[0.02] hover:text-white'}`}
              >
                <LayoutDashboard className="h-4 w-4" /> Analytics Engine
              </Link>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition group relative overflow-hidden ${pathname === '/admin/users' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'border-transparent text-muted-foreground hover:bg-white/[0.02] hover:text-white'}`}
              >
                <Users className="h-4 w-4" /> User Management
              </Link>

              <Link
                to="/admin/content"
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition group relative overflow-hidden ${pathname === '/admin/content' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'border-transparent text-muted-foreground hover:bg-white/[0.02] hover:text-white'}`}
              >
                <Database className="h-4 w-4" /> Content Manager
              </Link>

              <div className="h-px w-full bg-border/40 my-4" />

              <Link
                to="/countries"
                className="flex items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/[0.02] hover:text-white transition group relative overflow-hidden"
              >
                <ArrowLeft className="h-4 w-4" /> Return to App
              </Link>
            </nav>
          </div>

          <div className="mt-auto pt-6 border-t border-border/40">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Online
            </div>
          </div>
        </aside>

        {/* Analytics & Content Outlet Container */}
        <div className="flex-1 overflow-x-hidden relative">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(40%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[color:var(--primary)] to-cyan-500 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
          <div className="h-full">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  )
}
