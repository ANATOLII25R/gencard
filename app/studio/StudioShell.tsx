"use client";
import { useEffect, useState, useRef } from "react";
import "./studio-shell.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, LayoutDashboard, Zap, LogOut, Settings, Crown,
  Folder, Layers, Search, UploadCloud, Users, Bell,
  Package, Link2, ChevronRight, ChevronLeft, Globe, MoreHorizontal, Menu, X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { StudioContext } from "./StudioContext";
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

export default function StudioShell({ user, plan, projectCount, children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      setIsNarrow(mq.matches);
      if (!mq.matches) setMobileMenuOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Close search overlay when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      setSearchExpanded(false);
    }
  }, [sidebarOpen]);

  const showLabels = isNarrow ? mobileMenuOpen : sidebarOpen;
  const closeMobileNav = () => {
    if (isNarrow) setMobileMenuOpen(false);
  };

  const isAtLimit = plan === "FREE" && projectCount >= 3;

  // Store Icon component (not JSX instance) so we can render at any size
  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: "PAGINE",
      items: [
        { href: "/studio",          Icon: LayoutDashboard, label: "Studio",         badge: null,                                      badgeType: "number" },
        { href: "/studio/design",   Icon: Folder,          label: "I Miei Design",     badge: projectCount > 0 ? String(projectCount) : null, badgeType: "number" },
        { href: "/studio/template", Icon: Layers,          label: "Template",          badge: "8",                                       badgeType: "number" },
        { href: "/studio/prodotti", Icon: Package,         label: "Prodotti / Poster", badge: "Nuovo",                                   badgeType: "new"    },
      ],
    },
    {
      label: "STRUMENTI",
      items: [
        { href: "/studio/upload",       Icon: UploadCloud, label: "Upload / Risorse",  badge: null,  badgeType: "number" },
        { href: "/studio/team",         Icon: Users,       label: "Team & Utenti",     badge: null,  badgeType: "number" },
        { href: "/studio/integrazioni", Icon: Link2,       label: "Integrazioni API",  badge: "dot", badgeType: "dot"    },
      ],
    },
    {
      label: "SISTEMA",
      items: [
        { href: "/studio/impostazioni", Icon: Settings, label: "Impostazioni", badge: null, badgeType: "number" },
      ],
    },
  ];

  const allItems = navGroups.flatMap(g => g.items);
  const isActive = (href: string) => href === "/studio" ? pathname === href : pathname.startsWith(href);

  // Active page info for topbar
  const activeItem = allItems.find(i => isActive(i.href)) ?? { Icon: LayoutDashboard, label: "Studio" };
  const ActiveIcon = activeItem.Icon;
  const activeLabel = activeItem.label;
  const topbarTitle = pathname === "/studio" ? "Panoramica" : activeLabel;

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
    <div className="studio-root" style={{ background: DS.bg, color: DS.textPri, fontFamily: "'Inter','Plus Jakarta Sans',sans-serif" }}>

      {isNarrow && mobileMenuOpen && (
        <button
          type="button"
          aria-label="Chiudi menu"
          className="studio-sidebar-backdrop"
          style={{ border: "none", padding: 0, cursor: "pointer" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`studio-sidebar ${isNarrow ? "studio-sidebar--drawer" : ""} ${isNarrow && mobileMenuOpen ? "studio-sidebar--drawer-open" : ""}`}
        style={{
          background: DS.sidebar,
          borderRight: `1px solid ${DS.border}`,
          ...(isNarrow
            ? {}
            : { width: sidebarOpen ? "260px" : "72px" }),
        }}
      >

        {/* Logo — 64px height, 34px icon + 16px/800 text */}
        <div style={{ height: "64px", padding: "0 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: "linear-gradient(135deg,#7c3aed,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>
            <Zap size={17} color="white" fill="white" />
          </div>
          {showLabels && <span style={{ fontSize: "16px", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "-0.02em", flex: 1 }}>Gen<span style={{ color: DS.accent }}>Card</span></span>}
          {isNarrow && mobileMenuOpen && (
            <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Chiudi menu" style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMut, display: "flex", padding: "4px", borderRadius: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.background = DS.card)}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              <X size={16} />
            </button>
          )}
          {!isNarrow && showLabels && (
            <button 
              type="button" 
              onClick={() => setSidebarOpen(false)} 
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: DS.textMut, 
                display: "flex", 
                padding: "6px", 
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = DS.card;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = DS.textMut;
              }}
              aria-label="Comprimi menu"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ padding: "14px 12px 0", position: "relative" }}>
          {/* Expanded search overlay on page (when sidebar closed) */}
          {searchExpanded && !showLabels && (
            <>
              {/* Backdrop */}
              <div 
                onClick={() => { setSearchExpanded(false); setSearchQuery(""); }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 100,
                }}
              />
              {/* Search box floating on page */}
              <div 
                style={{
                  position: "fixed",
                  top: "80px",
                  left: "90px",
                  zIndex: 101,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: DS.card,
                  border: `1px solid ${DS.border}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  minWidth: "320px"
                }}
              >
                <Search size={18} color={DS.accent} />
                <input 
                  ref={searchInputRef}
                  autoFocus
                  placeholder="Cerca design, template..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: DS.textPri,
                    fontSize: "14px",
                    width: "100%"
                  }}
                />
                <button 
                  onClick={() => { setSearchExpanded(false); setSearchQuery(""); }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: DS.textMut,
                    padding: "4px",
                    display: "flex"
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </>
          )}
          
          {/* Normal search in sidebar (when expanded) */}
          {showLabels && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              background: "rgba(255,255,255,0.04)", 
              border: `1px solid ${DS.border}`, 
              borderRadius: "8px", 
              padding: "8px 12px"
            }}>
              <Search size={13} color={DS.textMut} />
              <input 
                placeholder="Cerca design, template..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: DS.textSec,
                  fontSize: "12px",
                  width: "100%"
                }}
              />
            </div>
          )}
          
          {/* Collapsed search icon in sidebar (when closed) */}
          {!showLabels && !searchExpanded && (
            <div 
              onClick={() => setSearchExpanded(true)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "8px", 
                background: "rgba(255,255,255,0.04)", 
                border: `1px solid ${DS.border}`, 
                borderRadius: "8px", 
                padding: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = DS.accent;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = DS.border;
              }}
            >
              <Search size={16} color={DS.textMut} />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {showLabels && <div style={{ fontSize: "10px", fontWeight: 700, color: DS.textMut, letterSpacing: "0.1em", padding: "0 8px 6px" }}>{group.label}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={closeMobileNav} style={{ display: "flex", alignItems: "center", gap: "10px", padding: showLabels ? "9px 12px" : "10px", justifyContent: showLabels ? "flex-start" : "center", borderRadius: "8px", background: active ? "rgba(99,102,241,0.25)" : "transparent", color: active ? "#fff" : DS.textSec, fontSize: "13px", fontWeight: active ? 600 : 500, transition: "all 0.15s", whiteSpace: "nowrap", width: "100%", textDecoration: "none" }}>
                      <span style={{ color: active ? DS.accent : "inherit", flexShrink: 0 }}><item.Icon size={16} /></span>
                      {showLabels && <span style={{ flex: 1 }}>{item.label}</span>}
                      {showLabels && item.badgeType === "number" && item.badge && <span style={{ fontSize: "10px", fontWeight: 700, background: "#232B45", color: DS.textSec, padding: "1px 6px", borderRadius: "10px" }}>{item.badge}</span>}
                      {showLabels && item.badgeType === "new" && <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(16,185,129,0.15)", color: DS.green, border: "1px solid rgba(16,185,129,0.3)", padding: "2px 7px", borderRadius: "10px" }}>Nuovo</span>}
                      {showLabels && item.badgeType === "dot" && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: DS.green, flexShrink: 0 }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div style={{ borderTop: `1px solid ${DS.border}`, padding: "12px" }}>
          {showLabels ? (
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
      <main className="studio-main">

        {/* Top Bar — mirrors sidebar logo: 64px, 34px icon box + 16px/800 title */}
        <div className="studio-topbar" style={{ borderBottom: `1px solid ${DS.border}`, background: "rgba(8,11,18,0.9)", backdropFilter: "blur(12px)" }}>

          {isNarrow && (
            <button type="button" aria-label="Apri menu" onClick={() => setMobileMenuOpen(true)} style={{ width: "38px", height: "38px", borderRadius: "9px", background: DS.card, border: `1px solid ${DS.border}`, color: DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Menu size={18} />
            </button>
          )}

          {/* Toggle sidebar when closed — ChevronRight beside page icon */}
          {!isNarrow && !showLabels && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: DS.card, border: `1px solid ${DS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: DS.textSec, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}
              aria-label="Espandi menu"
            >
              <ChevronRight size={17} />
            </button>
          )}

          {/* Active page icon — same 34×34px box as sidebar logo icon */}
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: DS.accentGl, border: `1px solid rgba(99,102,241,0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ActiveIcon size={17} color={DS.accent} />
          </div>

          {/* Title — same fontSize/fontWeight as sidebar "GenCard" text */}
          <h1 className="studio-topbar-title" style={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, whiteSpace: "nowrap" }}>
            {topbarTitle}
          </h1>

          <div style={{ flex: 1 }} />

          <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", border: `1px solid ${DS.border}`, background: "transparent", color: DS.textSec, fontSize: "13px", fontWeight: 500, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
            <Globe size={14} /> <span className="studio-topbar-link-text">Torna al sito</span>
          </a>

          <div style={{ width: "1px", height: "24px", background: DS.border }} />

          <button style={{ width: "38px", height: "38px", borderRadius: "9px", background: DS.card, border: `1px solid ${DS.border}`, color: DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
            <Bell size={16} />
          </button>

          <button
            type="button"
            aria-label={creating ? "Creazione in corso" : isAtLimit ? "Vai ai prezzi" : "Nuovo design"}
            onClick={createProject}
            disabled={creating || isAtLimit}
            style={{ background: isAtLimit ? "transparent" : "linear-gradient(135deg,#6366F1,#8b5cf6)", border: isAtLimit ? "1px solid rgba(99,102,241,0.4)" : "none", color: "#fff", padding: "8px 14px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: isAtLimit ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1, boxShadow: isAtLimit ? "none" : "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.2s", whiteSpace: "nowrap" }}
          >
            {isAtLimit ? <Crown size={16} /> : <Plus size={16} />}
            <span className="studio-topbar-btn-label">{creating ? "Creazione..." : isAtLimit ? "Aggiorna a Pro" : "Nuovo Design"}</span>
          </button>
        </div>

        {/* Content wrapper */}
        <div className="studio-content">
          <StudioContext.Provider value={{ user, plan, projectCount }}>
            {children}
          </StudioContext.Provider>
        </div>
      </main>
    </div>
  );
}
