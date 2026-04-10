"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, LayoutDashboard, Zap, LogOut, Settings, Crown,
  Folder, Layers, Search, UploadCloud, Users, Bell,
  Package, Link2, ChevronRight, Globe, MoreHorizontal, Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardContext } from "./DashboardContext";
import type { LucideIcon } from "lucide-react";
import type { PlanType } from "@/types";

const DS = {
  bg: "#080B12", sidebar: "#0C0F1A", card: "#111827",
  border: "#1E293B", accent: "#6366F1", accentGl: "rgba(99,102,241,0.15)",
  green: "#10B981", orange: "#F59E0B", red: "#EF4444",
  textPri: "#F8FAFC", textSec: "#94A3B8", textMut: "#475569",
};

const PLAN_LABEL: Record<PlanType, string> = { FREE: "Gratuito", PRO: "Pro", BUSINESS: "Business" };

interface NavItem {
  href: string;
  Icon: LucideIcon;
  label: string;
  badge: string | null;
  badgeType: "number" | "new" | "dot";
}

interface ShellProps {
  user: { id?: string; name?: string | null; email?: string | null };
  plan: PlanType;
  projectCount: number;
  children: React.ReactNode;
}

export default function DashboardShell({ user, plan, projectCount, children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const isAtLimit = plan === "FREE" && projectCount >= 3;

  // Store Icon component (not JSX instance) so we can render at any size
  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: "PAGINE",
      items: [
        { href: "/dashboard",          Icon: LayoutDashboard, label: "Dashboard",         badge: null,                                      badgeType: "number" },
        { href: "/dashboard/design",   Icon: Folder,          label: "I Miei Design",     badge: projectCount > 0 ? String(projectCount) : null, badgeType: "number" },
        { href: "/dashboard/template", Icon: Layers,          label: "Template",          badge: "8",                                       badgeType: "number" },
        { href: "/dashboard/prodotti", Icon: Package,         label: "Prodotti / Poster", badge: "Nuovo",                                   badgeType: "new"    },
      ],
    },
    {
      label: "STRUMENTI",
      items: [
        { href: "/dashboard/upload",       Icon: UploadCloud, label: "Upload / Risorse",  badge: null,  badgeType: "number" },
        { href: "/dashboard/team",         Icon: Users,       label: "Team & Utenti",     badge: null,  badgeType: "number" },
        { href: "/dashboard/integrazioni", Icon: Link2,       label: "Integrazioni API",  badge: "dot", badgeType: "dot"    },
      ],
    },
    {
      label: "SISTEMA",
      items: [
        { href: "/dashboard/impostazioni", Icon: Settings, label: "Impostazioni", badge: null, badgeType: "number" },
      ],
    },
  ];

  const allItems = navGroups.flatMap(g => g.items);
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Active page info for topbar
  const activeItem = allItems.find(i => isActive(i.href)) ?? { Icon: LayoutDashboard, label: "Dashboard" };
  const ActiveIcon = activeItem.Icon;
  const activeLabel = activeItem.label;
  const topbarTitle = pathname === "/dashboard" ? "Panoramica" : activeLabel;

  const createProject = async () => {
    if (isAtLimit) { router.push("/prezzi"); return; }
    setCreating(true);
    const res = await fetch("/api/progetti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Nuovo Design", width: 800, height: 600 }),
    });
    const proj = await res.json();
    setCreating(false);
    if (proj.id) router.push(`/editor/${proj.id}`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: DS.bg, color: DS.textPri, overflow: "hidden", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside style={{ width: sidebarOpen ? "260px" : "72px", background: DS.sidebar, borderRight: `1px solid ${DS.border}`, display: "flex", flexDirection: "column", transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden", flexShrink: 0, zIndex: 20 }}>

        {/* Logo — 64px height, 34px icon + 16px/800 text */}
        <div style={{ height: "64px", padding: "0 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: "linear-gradient(135deg,#7c3aed,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>
            <Zap size={17} color="white" fill="white" />
          </div>
          {sidebarOpen && <span style={{ fontSize: "16px", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "-0.02em", flex: 1 }}>Gen<span style={{ color: DS.accent }}>Card</span></span>}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMut, display: "flex", padding: "4px", borderRadius: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.background = DS.card)}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              <ChevronRight size={14} />
            </button>
          )}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMut, display: "flex", margin: "0 auto" }}>
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ padding: "14px 12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: `1px solid ${DS.border}`, borderRadius: "8px", padding: "8px 12px" }}>
            <Search size={13} color={DS.textMut} />
            {sidebarOpen && <input placeholder="Cerca design, template..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: DS.textSec, fontSize: "12px", width: "100%" }} />}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {sidebarOpen && <div style={{ fontSize: "10px", fontWeight: 700, color: DS.textMut, letterSpacing: "0.1em", padding: "0 8px 6px" }}>{group.label}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: sidebarOpen ? "9px 12px" : "10px", justifyContent: sidebarOpen ? "flex-start" : "center", borderRadius: "8px", background: active ? "rgba(99,102,241,0.25)" : "transparent", color: active ? "#fff" : DS.textSec, fontSize: "13px", fontWeight: active ? 600 : 500, transition: "all 0.15s", whiteSpace: "nowrap", width: "100%", textDecoration: "none" }}>
                      <span style={{ color: active ? DS.accent : "inherit", flexShrink: 0 }}><item.Icon size={16} /></span>
                      {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                      {sidebarOpen && item.badgeType === "number" && item.badge && <span style={{ fontSize: "10px", fontWeight: 700, background: "#232B45", color: DS.textSec, padding: "1px 6px", borderRadius: "10px" }}>{item.badge}</span>}
                      {sidebarOpen && item.badgeType === "new" && <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(16,185,129,0.15)", color: DS.green, border: "1px solid rgba(16,185,129,0.3)", padding: "2px 7px", borderRadius: "10px" }}>Nuovo</span>}
                      {sidebarOpen && item.badgeType === "dot" && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: DS.green, flexShrink: 0 }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade Banner */}
        {sidebarOpen && plan === "FREE" && (
          <div style={{ padding: "0 12px 14px" }}>
            <div style={{ borderRadius: "12px", padding: "14px", background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Passa a Pro</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.72)", marginBottom: "12px", lineHeight: 1.5 }}>Sblocca design illimitati e export PDF</div>
              <button onClick={() => router.push("/prezzi")} style={{ background: "rgba(0,0,0,0.25)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Upgrade →</button>
            </div>
          </div>
        )}

        {/* User Card */}
        <div style={{ borderTop: `1px solid ${DS.border}`, padding: "12px" }}>
          {sidebarOpen ? (
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0, background: DS.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff" }}>
                  {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email?.split("@")[0]}</div>
                  <div style={{ fontSize: "11px", color: DS.textMut, marginTop: "1px" }}>Piano {PLAN_LABEL[plan]}</div>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/" })} title="Esci" style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMut, display: "flex", padding: "4px", borderRadius: "4px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = DS.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = DS.textMut)}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
              {plan === "FREE" && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "5px" }}>
                    <span style={{ color: DS.textMut }}>Progetti usati</span>
                    <span style={{ color: isAtLimit ? DS.red : DS.textSec, fontWeight: 700 }}>{projectCount} / 3{isAtLimit ? " — al limite!" : ""}</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((projectCount / 3) * 100, 100)}%`, height: "100%", background: isAtLimit ? DS.red : DS.accent, borderRadius: "2px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "8px", border: "none", background: "transparent", color: DS.red, cursor: "pointer" }}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top Bar — mirrors sidebar logo: 64px, 34px icon box + 16px/800 title */}
        <div style={{ height: "64px", padding: "0 20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: `1px solid ${DS.border}`, background: "rgba(8,11,18,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>

          {/* Active page icon — same 34×34px box as sidebar logo icon */}
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: DS.accentGl, border: `1px solid rgba(99,102,241,0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ActiveIcon size={17} color={DS.accent} />
          </div>

          {/* Title — same fontSize/fontWeight as sidebar "GenCard" text */}
          <h1 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
            {topbarTitle}
          </h1>

          <div style={{ flex: 1 }} />

          <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: `1px solid ${DS.border}`, background: "transparent", color: DS.textSec, fontSize: "13px", fontWeight: 500, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
            <Globe size={14} /> Torna al sito
          </a>

          <div style={{ width: "1px", height: "24px", background: DS.border }} />

          <button style={{ width: "38px", height: "38px", borderRadius: "9px", background: DS.card, border: `1px solid ${DS.border}`, color: DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
            <Bell size={16} />
          </button>

          <button onClick={createProject} disabled={creating || isAtLimit} style={{ background: isAtLimit ? "transparent" : "linear-gradient(135deg,#6366F1,#8b5cf6)", border: isAtLimit ? "1px solid rgba(99,102,241,0.4)" : "none", color: "#fff", padding: "8px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: isAtLimit ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1, boxShadow: isAtLimit ? "none" : "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            <Plus size={16} />
            {creating ? "Creazione..." : isAtLimit ? "Upgrade →" : "Nuovo Design"}
          </button>
        </div>

        {/* Content wrapper */}
        <div style={{ flex: 1, padding: "24px 32px 32px", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
          {isAtLimit && (
            <div style={{ marginBottom: "24px", padding: "16px 24px", borderRadius: "12px", background: "linear-gradient(90deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Crown size={20} color={DS.orange} />
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>Limite raggiunto</strong>
                  <span style={{ fontSize: "12px", color: DS.textSec }}>Aggiorna a Pro per progetti illimitati e export PDF.</span>
                </div>
              </div>
              <button onClick={() => router.push("/prezzi")} style={{ background: "linear-gradient(135deg,#6366F1,#8b5cf6)", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" }}>
                Upgrade a Pro
              </button>
            </div>
          )}
          <DashboardContext.Provider value={{ user, plan, projectCount }}>
            {children}
          </DashboardContext.Provider>
        </div>
      </main>
    </div>
  );
}
