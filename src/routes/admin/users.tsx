import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Users, MoreHorizontal, ShieldCheck, Mail, Lock, Ban, Activity } from 'lucide-react'

export const Route = createFileRoute('/admin/users')({
    component: UserManagementDashboard,
})

const initialUsers = [
    { id: 1, email: 'olakazeem@outlook.com', role: 'admin', lastLogin: '2026-07-24T08:12:00Z', status: 'active', watchlists: 12 },
    { id: 2, email: 'investor.rel@capitalgp.com', role: 'user', lastLogin: '2026-07-23T14:45:00Z', status: 'active', watchlists: 4 },
    { id: 3, email: 'sarah.jenkins_law@techlegal.uk', role: 'user', lastLogin: '2026-07-20T09:12:00Z', status: 'active', watchlists: 15 },
    { id: 4, email: 'dev.tester09@gmail.com', role: 'user', lastLogin: '2026-06-15T10:00:00Z', status: 'suspended', watchlists: 0 },
    { id: 5, email: 'migration_consultant_1@ausvisas.au', role: 'user', lastLogin: '2026-07-22T21:30:00Z', status: 'active', watchlists: 42 },
];

function UserManagementDashboard() {
    const [users, setUsers] = useState(initialUsers)

    const toggleStatus = (id: number) => {
        setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x))
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">User Management</h1>
                    <p className="text-muted-foreground text-sm">Control platform access, monitor user sessions, and enforce security policies.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-border/50 text-sm font-medium text-white rounded-lg bg-card/40 hover:bg-white/5 transition flex items-center gap-2">
                        Export CSV
                    </button>
                    <button className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-[color:var(--primary)] glow-cyan transition flex items-center gap-2 hover:opacity-90">
                        <Mail className="h-4 w-4" /> Invite User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white mb-0.5">{users.length.toLocaleString()}</div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Registered Users</div>
                    </div>
                </div>
                <div className="rounded-xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 backdrop-blur-md p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full bg-[color:var(--primary)]/20 text-[color:var(--primary)] flex items-center justify-center shrink-0 border border-[color:var(--primary)]/30">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white mb-0.5">3,142</div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Active Weekly Sessions</div>
                    </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6 flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                        <Ban className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white mb-0.5">{users.filter(u => u.status === 'suspended').length}</div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Suspended Accounts</div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-black/20 text-muted-foreground font-medium border-b border-border/50 text-xs uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Email / Account</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Last Session</th>
                                <th className="px-6 py-4 font-semibold text-center">Active Watchlists</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.015] transition">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${user.role === 'admin' ? 'bg-[color:var(--primary)]/20 text-[color:var(--primary)] border border-[color:var(--primary)]/30' : 'bg-white/5 text-muted-foreground border border-border'}`}>
                                            {user.email.substring(0, 2).toUpperCase()}
                                        </div>
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[color:var(--primary)]/10 text-[color:var(--primary)] text-xs font-semibold uppercase tracking-widest">
                                                <ShieldCheck className="h-3 w-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'active' ? (
                                            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" title="Active" />
                                        ) : (
                                            <span className="inline-flex h-2 w-2 rounded-full bg-red-500" title="Suspended" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs">
                                        {new Date(user.lastLogin).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-white text-xs font-bold font-display">
                                            {user.watchlists}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.role !== 'admin' && (
                                                <button onClick={() => toggleStatus(user.id)} className="px-3 py-1.5 rounded bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 text-xs font-medium transition flex items-center gap-1.5">
                                                    {user.status === 'active' ? <><Ban className="h-3 w-3" /> Suspend</> : <><Lock className="h-3 w-3" /> Reactivate</>}
                                                </button>
                                            )}
                                            <button className="p-1.5 rounded-md text-muted-foreground hover:bg-white/10 hover:text-white transition">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
