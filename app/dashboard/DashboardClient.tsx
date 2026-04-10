"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, LayoutDashboard, Zap, LogOut, Settings, Crown,
  Trash2, Edit3, ChevronRight, Folder, Layers, Search,
  Image as ImageIcon, UploadCloud, Users, ArrowUpRight, ArrowDownRight,
  BarChart2, Activity, Bell, Menu, X, FileImage, Package,
  Star, TrendingUp, Clock, Check, Upload, Palette, Type,
  CreditCard, Link2, Shield, User as UserIcon, ChevronDown,
  Eye, Download, Copy, MoreHorizontal, Grid, List,
  Sparkles, Rocket, Target, Globe
} from "lucide-react";
import type { Project } from "@/types";
import type { PlanType } from "@/types";
import { signOut } from "next-auth/react";

// ─── Constants ────────────────────────────────────────────────
const DS = {
  bg:       "#080B12",
  sidebar:  "#0C0F1A",
  card:     "#111827",
  cardHov:  "#161E2E",
  border:   "#1E293B",
  accent:   "#6366F1",
  accentGl: "rgba(99,102,241,0.15)",
  blue:     "#3B82F6",
  green:    "#10B981",
  orange:   "#F59E0B",
  red:      "#EF4444",
  textPri:  "#F8FAFC",
  textSec:  "#94A3B8",
  textMut:  "#475569",
};

const PLAN_COLORS: Record<PlanType, string> = {
  FREE: DS.textMut,
  PRO:  DS.accent,
  BUSINESS: DS.orange,
};
const PLAN_LABEL: Record<PlanType, string> = {
  FREE: "Gratuito",
  PRO: "Pro",
  BUSINESS: "Business",
};

const TEMPLATES = [
  { name: "Apertura Negozio",  emoji: "🏪", cat: "Retail",    gradient: "linear-gradient(135deg,#667eea,#764ba2)", w: 800,  h: 600  },
  { name: "Evento Musicale",   emoji: "🎵", cat: "Events",    gradient: "linear-gradient(135deg,#f093fb,#f5576c)", w: 800,  h: 1100 },
  { name: "Menù Ristorante",   emoji: "🍕", cat: "Food",      gradient: "linear-gradient(135deg,#4facfe,#00f2fe)", w: 800,  h: 1200 },
  { name: "Saldi Estivi",      emoji: "☀️", cat: "Promo",     gradient: "linear-gradient(135deg,#43e97b,#38f9d7)", w: 800,  h: 600  },
  { name: "Compleanno",        emoji: "🎉", cat: "Social",    gradient: "linear-gradient(135deg,#fa709a,#fee140)", w: 800,  h: 800  },
  { name: "Corso / Workshop",  emoji: "📚", cat: "Education", gradient: "linear-gradient(135deg,#30cfd0,#667eea)", w: 800,  h: 1000 },
  { name: "Offerta Speciale",  emoji: "🏷️", cat: "Promo",     gradient: "linear-gradient(135deg,#f7971e,#ffd200)", w: 800,  h: 600  },
  { name: "Poster Moderno",    emoji: "🖼️", cat: "Art",       gradient: "linear-gradient(135deg,#1a1a2e,#504079)", w: 600,  h: 900  },
];

const ASSETS_MOCK = [
  { name: "logo-azienda.png",  type: "img",  size: "245 KB", date: "Ieri",        preview: "🖼️" },
  { name: "sfondo-natalizio.jpg", type: "img", size: "1.2 MB", date: "3 giorni fa", preview: "🌟" },
  { name: "icone-social.svg",  type: "icon", size: "48 KB",  date: "Una settimana fa", preview: "⬦" },
  { name: "Inter-Bold.ttf",    type: "font", size: "320 KB", date: "2 settimane fa", preview: "Aa" },
  { name: "Plus-Jakarta.ttf",  type: "font", size: "280 KB", date: "2 settimane fa", preview: "Aa" },
  { name: "pattern-geo.png",   type: "img",  size: "92 KB",  date: "3 settimane fa", preview: "⬡" },
];

// ─── Types ────────────────────────────────────────────────────
interface DashboardClientProps {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
  projects: Project[];
  plan: PlanType;
}

// ─── Sub-components ───────────────────────────────────────────
function StatCard({ icon, title, value, change, positive }: {
  icon: React.ReactNode; title: string; value: string; change: string; positive: boolean;
}) {
  return (
    <div style={{
      background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px",
      padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px",
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: DS.textSec, fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
          {icon} {title}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: positive ? DS.green : DS.red,
          background: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "2px"
        }}>
          {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {change}
        </span>
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, color: DS.textPri, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function DashboardClient({ user, projects, plan }: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [assetFilter, setAssetFilter] = useState<string>("all");

  const maxProjects = plan === "FREE" ? 3 : Infinity;
  const isAtLimit = plan === "FREE" && projects.length >= 3;

  const createProject = async (name: string, w = 800, h = 600) => {
    if (isAtLimit) { router.push("/prezzi"); return; }
    setCreating(true);
    const res = await fetch("/api/progetti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, width: w, height: h }),
    });
    const proj = await res.json();
    setCreating(false);
    if (proj.id) router.push(`/editor/${proj.id}`);
  };

  const deleteProject = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/progetti/${id}`, { method: "DELETE" });
    setDeletingId(null);
    startTransition(() => router.refresh());
  };

  // ── Nav groups ──
  const navGroups = [
    {
      label: "ALL PAGES",
      items: [
        { id: "dashboard",  icon: <LayoutDashboard size={16} />, label: "Dashboard",          badge: null },
        { id: "my-designs", icon: <Folder size={16} />,          label: "My Designs",          badge: projects.length > 0 ? String(projects.length) : null },
        { id: "templates",  icon: <Layers size={16} />,          label: "Templates",           badge: "8" },
        { id: "products",   icon: <Package size={16} />,         label: "Products / Posters",  badge: null },
      ],
    },
    {
      label: "FEATURES",
      items: [
        { id: "uploads",  icon: <UploadCloud size={16} />, label: "Upload / Assets", badge: String(ASSETS_MOCK.length) },
        { id: "users",    icon: <Users size={16} />,       label: "Users & Teams",   badge: null },
      ],
    },
    {
      label: "SYSTEMS",
      items: [
        { id: "settings", icon: <Settings size={16} />, label: "Settings", badge: null },
      ],
    },
  ];

  const activeLabel = navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label ?? "Overview";

  return (
    <div style={{ display: "flex", height: "100vh", background: DS.bg, color: DS.textPri, overflow: "hidden", fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? "260px" : "72px",
        background: DS.sidebar,
        borderRight: `1px solid ${DS.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", flexShrink: 0, zIndex: 20,
      }}>

        {/* Logo */}
        <div style={{
          height: "64px", padding: "0 20px",
          display: "flex", alignItems: "center", gap: "12px",
          borderBottom: `1px solid ${DS.border}`,
          cursor: "pointer",
        }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
            background: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 20px rgba(99,102,241,0.4)`,
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: "16px", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
              Volantino<span style={{ color: DS.accent }}>AI</span>
            </span>
          )}
          {sidebarOpen && <ChevronRight size={14} color={DS.textMut} style={{ marginLeft: "auto" }} />}
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: DS.card, border: `1px solid ${DS.border}`,
              borderRadius: "8px", padding: "8px 12px",
            }}>
              <Search size={14} color={DS.textMut} />
              <input
                placeholder="Search for..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: DS.textSec, fontSize: "13px", width: "100%",
                }}
              />
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div style={{ padding: "16px 18px 0", display: "flex", justifyContent: "center" }}>
            <Search size={16} color={DS.textMut} />
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {sidebarOpen && (
                <div style={{ fontSize: "10px", fontWeight: 700, color: DS.textMut, letterSpacing: "0.08em", padding: "0 8px 8px" }}>
                  {group.label}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map(item => {
                  const active = activeTab === item.id;
                  return (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: sidebarOpen ? "9px 12px" : "9px", justifyContent: sidebarOpen ? "flex-start" : "center",
                      borderRadius: "8px", border: "none", cursor: "pointer",
                      background: active ? DS.accentGl : "transparent",
                      borderLeft: active ? `2px solid ${DS.accent}` : "2px solid transparent",
                      color: active ? "#fff" : DS.textSec,
                      fontSize: "13px", fontWeight: active ? 600 : 500,
                      transition: "all 0.15s", whiteSpace: "nowrap", width: "100%", textAlign: "left",
                    }}
                      onMouseEnter={e => !active && ((e.currentTarget.style.background = DS.card), (e.currentTarget.style.color = "#fff"))}
                      onMouseLeave={e => !active && ((e.currentTarget.style.background = "transparent"), (e.currentTarget.style.color = DS.textSec))}
                    >
                      <span style={{ color: active ? DS.accent : "inherit", flexShrink: 0 }}>{item.icon}</span>
                      {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                      {sidebarOpen && item.badge && (
                        <span style={{ fontSize: "10px", fontWeight: 700, background: active ? DS.accent : DS.border, color: active ? "#fff" : DS.textSec, padding: "1px 6px", borderRadius: "10px" }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div style={{ borderTop: `1px solid ${DS.border}`, padding: "16px 12px" }}>
          {sidebarOpen && (
            <div style={{
              background: DS.card, border: `1px solid ${DS.border}`,
              borderRadius: "10px", padding: "12px", marginBottom: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 700, color: "#fff"
                }}>
                  {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name || user.email}
                  </div>
                  <div style={{ fontSize: "11px", color: PLAN_COLORS[plan], display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    {plan === "PRO" && <Crown size={10} />}
                    {plan === "BUSINESS" && <Sparkles size={10} />}
                    Piano {PLAN_LABEL[plan]}
                  </div>
                </div>
              </div>
              {plan === "FREE" && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: DS.textMut, marginBottom: "4px" }}>
                    <span>Progetti</span><span style={{ color: projects.length >= 3 ? DS.red : DS.textSec }}>{projects.length} / 3</span>
                  </div>
                  <div style={{ height: "3px", background: DS.border, borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((projects.length / 3) * 100, 100)}%`, height: "100%", background: projects.length >= 3 ? DS.red : DS.accent, borderRadius: "2px" }} />
                  </div>
                </div>
              )}
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 12px", borderRadius: "8px", border: "none",
            background: "transparent", color: "#ef4444", fontSize: "13px",
            fontWeight: 500, cursor: "pointer", width: "100%",
            justifyContent: sidebarOpen ? "flex-start" : "center", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={16} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top Bar */}
        <div style={{
          height: "64px", padding: "0 32px",
          display: "flex", alignItems: "center", gap: "16px",
          borderBottom: `1px solid ${DS.border}`,
          background: `rgba(8,11,18,0.9)`, backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {activeTab === "dashboard" ? "Overview" : activeLabel}
          </h1>
          <div style={{ flex: 1 }} />

          {/* Notification bell */}
          <button style={{ width: "36px", height: "36px", borderRadius: "8px", background: DS.card, border: `1px solid ${DS.border}`, color: DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={15} />
          </button>

          {/* New Design CTA */}
          <button onClick={() => createProject("Nuovo Design")} disabled={creating || isAtLimit} style={{
            background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`,
            color: "#fff", padding: "8px 20px", borderRadius: "8px",
            border: "none", fontSize: "13px", fontWeight: 700,
            display: "flex", alignItems: "center", gap: "8px",
            cursor: isAtLimit ? "not-allowed" : "pointer",
            opacity: creating ? 0.7 : 1,
            boxShadow: `0 4px 20px rgba(99,102,241,0.35)`,
            transition: "all 0.2s",
          }}>
            <Plus size={16} />
            {creating ? "Creazione..." : isAtLimit ? "Upgrade →" : "Nuovo Design"}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "32px", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>

          {/* Upgrade Banner */}
          {isAtLimit && (
            <div style={{
              marginBottom: "28px", padding: "16px 24px", borderRadius: "12px",
              background: `linear-gradient(90deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))`,
              border: `1px solid rgba(99,102,241,0.3)`,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Crown size={20} color={DS.orange} />
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>Limite raggiunto</strong>
                  <span style={{ fontSize: "12px", color: DS.textSec }}>Aggiorna a Pro per progetti illimitati e export PDF.</span>
                </div>
              </div>
              <button onClick={() => router.push("/prezzi")} style={{
                background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, color: "#fff", border: "none",
                padding: "8px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap"
              }}>
                Upgrade a Pro
              </button>
            </div>
          )}

          {/* ─── TAB: DASHBOARD ────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Welcome */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                    Welcome back, <span style={{ background: `linear-gradient(90deg, ${DS.accent}, #a78bfa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user.name?.split(" ")[0] || "Designer"}</span> 👋
                  </h2>
                  <p style={{ color: DS.textSec, fontSize: "14px", margin: 0 }}>
                    Ecco un riepilogo della tua attività recente.
                  </p>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <StatCard icon={<Eye size={13} />}        title="Pageviews"      value="50.8K" change="+28.4%" positive={true} />
                <StatCard icon={<Users size={13} />}      title="Monthly users"  value="23.6K" change="-12.6%" positive={false} />
                <StatCard icon={<Rocket size={13} />}     title="New sign ups"   value="756"   change="+3.1%"  positive={true} />
                <StatCard icon={<CreditCard size={13} />} title="Subscriptions"  value="2.3K"  change="+11.3%" positive={true} />
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
                {/* Revenue Chart */}
                <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", overflow: "hidden", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: DS.textSec, display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                        <TrendingUp size={13} /> Total revenue
                      </div>
                      <div style={{ fontSize: "34px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                        $240.8K <span style={{ fontSize: "14px", fontWeight: 600, background: "rgba(16,185,129,0.12)", color: DS.green, padding: "3px 8px", borderRadius: "20px", verticalAlign: "middle" }}>+24.6%</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["1W","1M","3M","YTD"].map((p,i) => (
                        <button key={p} style={{ padding: "4px 10px", borderRadius: "6px", border: `1px solid ${i===1 ? DS.accent : DS.border}`, background: i===1 ? DS.accentGl : "transparent", color: i===1 ? "#fff" : DS.textSec, fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "200px", marginTop: "24px", position: "relative" }}>
                    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={DS.accent} stopOpacity="0.5"/>
                          <stop offset="100%" stopColor={DS.accent} stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="gr2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={DS.blue} stopOpacity="0.3"/>
                          <stop offset="100%" stopColor={DS.blue} stopOpacity="0"/>
                        </linearGradient>
                        <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      {/* Blue line */}
                      <path d="M0,160 C100,130 200,170 320,120 C440,70 560,150 680,90 C740,62 780,80 800,60" fill="none" stroke={DS.blue} strokeWidth="2.5" opacity="0.7"/>
                      <path d="M0,160 C100,130 200,170 320,120 C440,70 560,150 680,90 C740,62 780,80 800,60 L800,200 L0,200Z" fill="url(#gr2)"/>
                      {/* Purple line */}
                      <path d="M0,180 C120,90 200,140 350,60 C500,180 650,30 800,90" fill="none" stroke={DS.accent} strokeWidth="3" filter="url(#glow)"/>
                      <path d="M0,180 C120,90 200,140 350,60 C500,180 650,30 800,90 L800,200 L0,200Z" fill="url(#gr1)"/>
                      {/* Tooltip dot */}
                      <circle cx="350" cy="60" r="6" fill={DS.sidebar} stroke={DS.accent} strokeWidth="2.5"/>
                    </svg>
                    {/* Tooltip */}
                    <div style={{ position: "absolute", top: "20px", left: "42%", background: DS.sidebar, border: `1px solid ${DS.border}`, borderRadius: "8px", padding: "8px 12px", pointerEvents: "none" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>$125.2k <span style={{ color: DS.green, fontSize: "11px" }}>+12.6%</span></div>
                      <div style={{ fontSize: "10px", color: DS.textMut }}>June 21, 2023</div>
                    </div>
                  </div>
                  {/* X axis */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                      <span key={m} style={{ fontSize: "10px", color: DS.textMut }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Profit */}
                  <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px", flex: 1 }}>
                    <div style={{ fontSize: "12px", color: DS.textSec, display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <BarChart2 size={13}/> Total profit
                    </div>
                    <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                      $144.6K <span style={{ fontSize: "12px", background: "rgba(16,185,129,0.12)", color: DS.green, padding: "2px 6px", borderRadius: "12px" }}>+20.5%</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "70px" }}>
                      {[40,65,30,80,55,90,45,70,85,50,75,60].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, background: i % 3 === 0 ? DS.accent : i % 3 === 1 ? DS.blue : "#8b5cf6", borderRadius: "3px 3px 0 0", opacity: 0.85 }}/>
                      ))}
                    </div>
                  </div>

                  {/* Active sessions */}
                  <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "12px", color: DS.textSec, display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <Activity size={13}/> Active sessions
                    </div>
                    <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                      400 <span style={{ fontSize: "12px", background: "rgba(16,185,129,0.12)", color: DS.green, padding: "2px 6px", borderRadius: "12px" }}>+16.8%</span>
                    </div>
                    {/* Mini line */}
                    <svg width="100%" height="40" viewBox="0 0 200 40">
                      <path d="M0,30 C30,20 60,35 90,15 C120,5 150,25 200,10" fill="none" stroke={DS.green} strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Projects quick view */}
              {projects.length > 0 && (
                <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: 0 }}>Design Recenti</h3>
                    <button onClick={() => setActiveTab("my-designs")} style={{ fontSize: "12px", color: DS.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      Vedi tutti <ChevronRight size={12}/>
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                    {projects.slice(0,4).map(p => (
                      <div key={p.id} onClick={() => router.push(`/editor/${p.id}`)} style={{
                        borderRadius: "10px", overflow: "hidden", background: DS.bg,
                        border: `1px solid ${DS.border}`, cursor: "pointer", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = DS.accent)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = DS.border)}
                      >
                        <div style={{ height: "90px", background: `linear-gradient(135deg, #1e293b, #0f172a)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {p.thumbnail ? <img src={p.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <Edit3 size={24} color={DS.textMut}/>}
                        </div>
                        <div style={{ padding: "10px 12px" }}>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: DS.textMut, marginTop: "2px" }}>{new Date(p.updatedAt).toLocaleDateString("it-IT",{month:"short",day:"numeric"})}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: MY DESIGNS ───────────────────────────────── */}
          {activeTab === "my-designs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>I miei Design</h2>
                  <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>{projects.length} progetti salvati</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setViewMode("grid")} style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${viewMode==="grid" ? DS.accent : DS.border}`, background: viewMode==="grid" ? DS.accentGl : DS.card, color: viewMode==="grid" ? "#fff" : DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Grid size={14}/>
                  </button>
                  <button onClick={() => setViewMode("list")} style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${viewMode==="list" ? DS.accent : DS.border}`, background: viewMode==="list" ? DS.accentGl : DS.card, color: viewMode==="list" ? "#fff" : DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <List size={14}/>
                  </button>
                </div>
              </div>

              {projects.length === 0 ? (
                <div style={{ background: DS.card, border: `2px dashed ${DS.border}`, borderRadius: "16px", padding: "80px 20px", textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", background: DS.accentGl, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Folder size={28} color={DS.accent}/>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Nessun design ancora</h3>
                  <p style={{ color: DS.textSec, maxWidth: "360px", margin: "0 auto 24px", fontSize: "14px" }}>Crea il tuo primo progetto o scegli un template per iniziare.</p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button onClick={() => createProject("Nuovo Volantino")} style={{ background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Plus size={16}/> Crea Design
                    </button>
                    <button onClick={() => setActiveTab("templates")} style={{ background: DS.card, color: DS.textSec, border: `1px solid ${DS.border}`, padding: "10px 24px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
                      Scegli Template
                    </button>
                  </div>
                </div>
              ) : viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ borderRadius: "14px", overflow: "hidden", background: DS.card, border: `1px solid ${DS.border}`, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4)`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div onClick={() => router.push(`/editor/${proj.id}`)} style={{ height: "170px", cursor: "pointer", background: `linear-gradient(135deg, #1e293b, #0f172a)`, position: "relative", overflow: "hidden" }}>
                        {proj.thumbnail ? <img src={proj.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
                            <Edit3 size={40} color={DS.accent}/>
                          </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", opacity: 0 }} className="hover-overlay"/>
                      </div>
                      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ overflow: "hidden" }}>
                          <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.name}</h4>
                          <span style={{ fontSize: "11px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={10}/> {new Date(proj.updatedAt).toLocaleDateString("it-IT",{month:"short",day:"numeric",year:"numeric"})}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button onClick={() => router.push(`/editor/${proj.id}`)} style={{ width: "30px", height: "30px", borderRadius: "7px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
                            <Edit3 size={12}/>
                          </button>
                          <button onClick={() => deleteProject(proj.id)} disabled={deletingId === proj.id} style={{ width: "30px", height: "30px", borderRadius: "7px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = DS.red; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "10px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = DS.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = DS.border)}
                    >
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: `linear-gradient(135deg, #1e293b, #0f172a)`, overflow: "hidden", flexShrink: 0 }}>
                        {proj.thumbnail ? <img src={proj.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={18} color={DS.textMut}/></div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{proj.name}</div>
                        <div style={{ fontSize: "12px", color: DS.textMut, marginTop: "2px" }}>{proj.width}×{proj.height}px · Modificato {new Date(proj.updatedAt).toLocaleDateString("it-IT")}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => router.push(`/editor/${proj.id}`)} style={{ padding: "6px 14px", borderRadius: "6px", background: DS.accentGl, border: `1px solid rgba(99,102,241,0.3)`, color: DS.accent, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Modifica</button>
                        <button onClick={() => deleteProject(proj.id)} style={{ width: "30px", height: "30px", borderRadius: "6px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={13}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: TEMPLATES ────────────────────────────────── */}
          {activeTab === "templates" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Template Pronti</h2>
                <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Scegli un punto di partenza e personalizzalo con l'editor.</p>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Tutti","Retail","Events","Food","Promo","Education","Social","Art"].map(cat => (
                  <button key={cat} style={{
                    padding: "6px 16px", borderRadius: "20px", border: `1px solid ${DS.border}`,
                    background: cat === "Tutti" ? DS.accent : DS.card,
                    color: cat === "Tutti" ? "#fff" : DS.textSec,
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { if(cat !== "Tutti") { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}}
                    onMouseLeave={e => { if(cat !== "Tutti") { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}}
                  >{cat}</button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                {TEMPLATES.map((tpl, i) => (
                  <div key={i} onClick={() => !isAtLimit && createProject(tpl.name, tpl.w, tpl.h)} style={{
                    borderRadius: "14px", background: DS.card, border: `1px solid ${DS.border}`,
                    cursor: isAtLimit ? "not-allowed" : "pointer", overflow: "hidden", transition: "all 0.2s",
                    opacity: isAtLimit ? 0.5 : 1,
                  }}
                    onMouseEnter={e => !isAtLimit && (e.currentTarget.style.borderColor = DS.accent, e.currentTarget.style.transform = "translateY(-3px)", e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4)`)}
                    onMouseLeave={e => !isAtLimit && (e.currentTarget.style.borderColor = DS.border, e.currentTarget.style.transform = "none", e.currentTarget.style.boxShadow = "none")}
                  >
                    <div style={{ height: "140px", background: tpl.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", position: "relative" }}>
                      {tpl.emoji}
                      <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.4)", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#fff" }}>
                        {tpl.cat}
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{tpl.name}</div>
                      <div style={{ fontSize: "11px", color: DS.textMut }}>Formato: {tpl.w}×{tpl.h}px</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB: PRODUCTS ─────────────────────────────────── */}
          {activeTab === "products" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Products & Posters</h2>
                <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Tipi di contenuto che puoi creare con VolantinoAI.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {[
                  { icon: <FileImage size={28}/>,   title: "Volantini",      desc: "Promozioni, svendite, aperture. Stampa-pronti in alta risoluzione.", status: "Attivo",   badge: DS.green },
                  { icon: <Package size={28}/>,     title: "Poster",         desc: "A3, A2, A1. Design verticali per eventi, concerti e mostre.",      status: "Attivo",   badge: DS.green },
                  { icon: <Globe size={28}/>,       title: "Social Media",   desc: "Post e stories ottimizzati per Instagram, Facebook e TikTok.",     status: "Attivo",   badge: DS.green },
                  { icon: <Layers size={28}/>,      title: "Brochure",       desc: "Pieghevoli, depliant e presentazioni aziendali multi-pagina.",     status: "Presto",   badge: DS.orange },
                  { icon: <Target size={28}/>,      title: "Banner Web",     desc: "Banner pubblicitari per campagne Google, display e retargeting.",   status: "Presto",   badge: DS.orange },
                  { icon: <Palette size={28}/>,     title: "Brand Kit",      desc: "Mantieni coerenza visiva su tutti i tuoi materiali aziendali.",     status: "Pro",      badge: DS.accent },
                ].map((item, i) => (
                  <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", transition: "all 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = DS.accent, e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = DS.border, e.currentTarget.style.transform = "none")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: `${item.badge}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.badge }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: item.badge, background: `${item.badge}18`, padding: "3px 10px", borderRadius: "20px" }}>
                        {item.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{item.title}</h3>
                    <p style={{ fontSize: "13px", color: DS.textSec, margin: "0 0 16px", lineHeight: 1.6 }}>{item.desc}</p>
                    <button onClick={() => item.status === "Attivo" && createProject(`Nuovo ${item.title}`)} style={{
                      width: "100%", padding: "9px", borderRadius: "8px",
                      background: item.status === "Attivo" ? DS.accentGl : "transparent",
                      border: `1px solid ${item.status === "Attivo" ? "rgba(99,102,241,0.3)" : DS.border}`,
                      color: item.status === "Attivo" ? "#fff" : DS.textMut,
                      fontSize: "13px", fontWeight: 600, cursor: item.status === "Attivo" ? "pointer" : "default",
                    }}>
                      {item.status === "Attivo" ? "Crea Adesso" : item.status === "Presto" ? "In Arrivo" : "Richiede Pro"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB: UPLOADS ──────────────────────────────────── */}
          {activeTab === "uploads" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Upload & Assets</h2>
                  <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Logo, immagini, icone e font personali.</p>
                </div>
                <button style={{ background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, color: "#fff", border: "none", padding: "9px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Upload size={15}/> Carica File
                </button>
              </div>

              {/* Drop Zone */}
              <div style={{ border: `2px dashed ${DS.border}`, borderRadius: "14px", padding: "40px", textAlign: "center", background: DS.card, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = DS.accent, e.currentTarget.style.background = DS.accentGl)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = DS.border, e.currentTarget.style.background = DS.card)}
              >
                <UploadCloud size={36} color={DS.textMut} style={{ margin: "0 auto 12px" }}/>
                <p style={{ color: DS.textSec, margin: "0 0 4px", fontSize: "14px", fontWeight: 600 }}>Trascina file qui o clicca per caricare</p>
                <p style={{ color: DS.textMut, margin: 0, fontSize: "12px" }}>PNG, JPG, SVG, TTF — Max 10MB per file</p>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[{v:"all",l:"Tutti"},{v:"img",l:"Immagini"},{v:"icon",l:"Icone"},{v:"font",l:"Font"}].map(f => (
                  <button key={f.v} onClick={() => setAssetFilter(f.v)} style={{ padding: "6px 16px", borderRadius: "20px", border: `1px solid ${assetFilter===f.v ? DS.accent : DS.border}`, background: assetFilter===f.v ? DS.accent : DS.card, color: assetFilter===f.v ? "#fff" : DS.textSec, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    {f.l}
                  </button>
                ))}
              </div>

              {/* Assets table */}
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 100px 140px 100px", padding: "12px 16px", background: DS.bg, borderBottom: `1px solid ${DS.border}`, fontSize: "11px", fontWeight: 700, color: DS.textMut, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <span></span><span>Nome</span><span>Tipo</span><span>Caricato</span><span>Dimensione</span>
                </div>
                {ASSETS_MOCK.filter(a => assetFilter === "all" || a.type === assetFilter).map((asset, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr 100px 140px 100px", padding: "14px 16px", borderBottom: `1px solid ${DS.border}`, alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = DS.cardHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: "36px", height: "36px", background: DS.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", border: `1px solid ${DS.border}` }}>
                      {asset.preview}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{asset.name}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: asset.type === "img" ? DS.blue : asset.type === "font" ? DS.green : DS.orange, background: asset.type === "img" ? "rgba(59,130,246,0.1)" : asset.type === "font" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>
                      {asset.type === "img" ? "IMG" : asset.type === "icon" ? "SVG" : "FONT"}
                    </span>
                    <span style={{ fontSize: "12px", color: DS.textSec }}>{asset.date}</span>
                    <span style={{ fontSize: "12px", color: DS.textMut }}>{asset.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB: USERS ────────────────────────────────────── */}
          {activeTab === "users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Users & Teams</h2>
                <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Collaborazione e gestione team disponibile nel piano Business.</p>
              </div>
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "16px", padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: "72px", height: "72px", background: `rgba(245,158,11,0.1)`, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Users size={32} color={DS.orange}/>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Funzione Teams in Arrivo</h3>
                <p style={{ color: DS.textSec, maxWidth: "400px", margin: "0 auto 28px", fontSize: "14px", lineHeight: 1.7 }}>
                  Presto potrai invitare collaboratori, assegnare ruoli e gestire le risorse condivise del tuo team.
                </p>
                <button onClick={() => router.push("/prezzi")} style={{ background: `linear-gradient(135deg,${DS.orange},#ec4899)`, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px", boxShadow: `0 4px 20px rgba(245,158,11,0.3)` }}>
                  Guarda i Piani
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB: SETTINGS ─────────────────────────────────── */}
          {activeTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Impostazioni</h2>
                <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Gestisci il tuo account, abbonamento e integrazioni.</p>
              </div>

              {/* Account */}
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
                  <UserIcon size={15} color={DS.accent}/><span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Profilo Account</span>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{user.name || "—"}</div>
                      <div style={{ fontSize: "13px", color: DS.textSec }}>{user.email}</div>
                    </div>
                  </div>
                  {[
                    { label: "Nome", value: user.name || "—" },
                    { label: "Email", value: user.email || "—" },
                  ].map((f,i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "16px" }}>
                      <label style={{ fontSize: "13px", color: DS.textSec, fontWeight: 500 }}>{f.label}</label>
                      <input defaultValue={f.value} style={{ background: DS.bg, border: `1px solid ${DS.border}`, borderRadius: "8px", padding: "9px 14px", color: "#fff", fontSize: "13px", outline: "none" }}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan */}
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
                  <CreditCard size={15} color={DS.accent}/><span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Abbonamento</span>
                </div>
                <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{PLAN_LABEL[plan]}</div>
                    <div style={{ fontSize: "13px", color: DS.textSec, marginTop: "4px" }}>
                      {plan === "FREE" ? "3 progetti, export PNG" : plan === "PRO" ? "Progetti illimitati, export PDF" : "Tutto incluso + teams"}
                    </div>
                  </div>
                  {plan === "FREE" && (
                    <button onClick={() => router.push("/prezzi")} style={{ background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Crown size={15}/> Upgrade a Pro
                    </button>
                  )}
                </div>
              </div>

              {/* Integrations */}
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Link2 size={15} color={DS.accent}/><span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Integrazioni</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    { name: "GitHub OAuth",  icon: "⬛", desc: "Login con GitHub",        connected: true },
                    { name: "Stripe",         icon: "💳", desc: "Pagamenti e abbonamenti", connected: false },
                    { name: "Google OAuth",   icon: "🔵", desc: "Login con Google",        connected: false },
                  ].map((int, i) => (
                    <div key={i} style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: DS.bg, border: `1px solid ${DS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                        {int.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{int.name}</div>
                        <div style={{ fontSize: "12px", color: DS.textSec }}>{int.desc}</div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: int.connected ? DS.green : DS.textMut, background: int.connected ? "rgba(16,185,129,0.1)" : DS.bg, border: `1px solid ${int.connected ? "rgba(16,185,129,0.3)" : DS.border}`, padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
                        {int.connected && <Check size={10}/>}{int.connected ? "Connesso" : "Non connesso"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div style={{ background: "rgba(239,68,68,0.05)", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: "14px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: DS.red }}>Elimina Account</div>
                  <div style={{ fontSize: "12px", color: DS.textSec, marginTop: "2px" }}>Questa azione è irreversibile e cancellerà tutti i dati.</div>
                </div>
                <button style={{ padding: "9px 20px", borderRadius: "8px", background: "transparent", border: `1px solid rgba(239,68,68,0.4)`, color: DS.red, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Elimina
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
