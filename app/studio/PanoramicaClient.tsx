"use client";
import {
  CheckCircle2, Code2, Download, Trash2,
  Layers, ShoppingBag, Calendar, UtensilsCrossed, Tag, GraduationCap, Share2, Palette,
  Clock, Edit3, Folder,
} from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", green: "#10B981", red: "#EF4444",
  textPri: "#F8FAFC", textSec: "#94A3B8", textMut: "#475569",
};

interface Props {
  recentProjects: Project[];
  firstName: string;
}

// Card preview SVG component (like the business card image)
function CardPreview({ color, icon }: { color: string; icon: React.ReactNode }) {
  return (
    <div style={{ 
      width: "56px", 
      height: "36px", 
      borderRadius: "6px", 
      background: `linear-gradient(135deg, ${color}, #1e40af)`,
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Curved decoration */}
      <div style={{
        position: "absolute",
        right: "-10px",
        top: "-10px",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.15)"
      }} />
      <div style={{
        position: "absolute",
        left: "-5px",
        bottom: "-5px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)"
      }} />
      <span style={{ color: "#fff", opacity: 0.9 }}>{icon}</span>
    </div>
  );
}

function StatCard({ title, subtitle, count, color, icon }: { 
  title: string; 
  subtitle: string;
  count: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{ 
      background: DS.card, 
      border: `1px solid ${DS.border}`, 
      borderRadius: "14px", 
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    }}>
      {/* Left: Text and counter */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <div style={{ fontSize: "13px", color: DS.textPri, fontWeight: 500, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: "11px", color: DS.textMut, lineHeight: 1.3 }}>{subtitle}</div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: color, letterSpacing: "-0.02em", marginTop: "4px" }}>{count}</div>
      </div>
      
      {/* Right: Card preview */}
      <CardPreview color={color} icon={icon} />
    </div>
  );
}

export default function PanoramicaClient({ recentProjects, firstName }: Props) {
  return (
    <div className="studio-page">

      {/* Header */}
      <div>
        <h2 className="studio-page-title" style={{ fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          Bentornato, <span style={{ background: `linear-gradient(90deg, ${DS.accent}, #a78bfa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{firstName}</span> 👋
        </h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Ecco un riepilogo della tua attività recente.</p>
      </div>

      {/* KPIs */}
      <div className="studio-grid-kpi">
        <StatCard title="Progetti completati"  subtitle="Progetti terminati"     count="24"   color="#10B981" icon={<CheckCircle2 size={14} />} />
        <StatCard title="In sviluppo"          subtitle="Progetti in corso"      count="8"    color="#6366F1" icon={<Code2 size={14} />} />
        <StatCard title="File scaricati"       subtitle="Download totali"        count="156"  color="#3B82F6" icon={<Download size={14} />} />
        <StatCard title="File eliminati"       subtitle="Cestino"               count="12"   color="#EF4444" icon={<Trash2 size={14} />} />
      </div>

      {/* Charts row */}
      <div className="studio-grid-charts">
        {/* Categories Grid */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "13px", color: DS.textSec, fontWeight: 600, marginBottom: "16px" }}>Categorie</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { name: "Tutti", Icon: Layers, color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
              { name: "Retail", Icon: ShoppingBag, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
              { name: "Events", Icon: Calendar, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
              { name: "Food", Icon: UtensilsCrossed, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
              { name: "Promo", Icon: Tag, color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
              { name: "Education", Icon: GraduationCap, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
              { name: "Social", Icon: Share2, color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
              { name: "Art", Icon: Palette, color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
            ].map((cat, i) => (
              <button
                key={i}
                style={{
                  background: "transparent",
                  border: `1px solid ${DS.border}`,
                  borderRadius: "12px",
                  padding: "16px 8px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = cat.bg;
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = DS.border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: cat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <cat.Icon size={20} color={cat.color} />
                </div>
                <span style={{ fontSize: "12px", color: DS.textSec, fontWeight: 500 }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Attività Recente</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { action: "Nuovo design creato", time: "2 min fa",  color: DS.accent },
              { action: "Template scaricato",   time: "1 ora fa",  color: DS.green  },
              { action: "Progetto modificato",  time: "3 ore fa",  color: "#F59E0B" },
              { action: "PDF esportato",         time: "Ieri",      color: DS.green  },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#fff", fontWeight: 500 }}>{a.action}</div>
                  <div style={{ fontSize: "11px", color: DS.textMut }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Design Recenti</div>
          <Link href="/studio/design" style={{ fontSize: "12px", color: DS.accent, textDecoration: "none", fontWeight: 600 }}>Vedi tutti →</Link>
        </div>
        {recentProjects.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Folder size={32} color={DS.textMut} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>
              Nessun design ancora.{" "}
              <Link href="/studio/design" style={{ color: DS.accent }}>Crea il tuo primo</Link>
            </p>
          </div>
        ) : (
          recentProjects.map(p => (
            <Link key={p.id} href={`/editor/${p.id}`} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: `1px solid ${DS.border}`, textDecoration: "none" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg,#1e293b,#0f172a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Edit3 size={16} color={DS.accent} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <Clock size={10} /> {new Date(p.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
