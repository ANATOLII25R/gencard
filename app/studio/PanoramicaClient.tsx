"use client";
import {
  CheckCircle2, Code2, Download, Trash2,
  Layers, ShoppingBag, Calendar, UtensilsCrossed, Tag, GraduationCap, Share2, Palette,
  Clock, Edit3, Folder, Sparkles, Search,
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
  completedCount: number;
  inProgressCount: number;
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

export default function PanoramicaClient({ recentProjects, firstName, completedCount, inProgressCount }: Props) {
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
        <StatCard title="Progetti completati"  subtitle="Progetti terminati"     count={String(completedCount)}   color="#10B981" icon={<CheckCircle2 size={14} />} />
        <StatCard title="In sviluppo"          subtitle="Progetti in corso"      count={String(inProgressCount)}    color="#6366F1" icon={<Code2 size={14} />} />
        <StatCard title="File scaricati"       subtitle="Download totali"        count="156"  color="#3B82F6" icon={<Download size={14} />} />
        <StatCard title="File eliminati"       subtitle="Cestino"               count="12"   color="#EF4444" icon={<Trash2 size={14} />} />
      </div>

      {/* Charts row */}
      <div className="studio-grid-charts">
        {/* Template Cards Grid */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "13px", color: DS.textSec, fontWeight: 600, marginBottom: "16px" }}>Template Popolari</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
            {[
              { 
                category: "Retail", 
                title: "Apertura Negozio", 
                description: "Volantino per nuova attività commerciale",
                image: "/categories/retail.png"
              },
              { 
                category: "Events", 
                title: "Evento Musicale", 
                description: "Concerti, feste e spettacoli dal vivo",
                image: "/categories/events.png"
              },
              { 
                category: "Food", 
                title: "Menù Ristorante", 
                description: "Carta dei piatti e bevande",
                image: "/categories/food.png"
              },
              { 
                category: "Promo", 
                title: "Saldi Estivi", 
                description: "Offerte speciali e sconti stagionali",
                image: "/categories/promo.png"
              },
              { 
                category: "Education", 
                title: "Corso / Workshop", 
                description: "Formazione professionale e seminari",
                image: "/categories/education.png"
              },
            ].map((template, i) => (
              <button
                key={i}
                style={{
                  position: "relative",
                  height: "160px",
                  border: `1px solid ${DS.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Full cover image */}
                <img 
                  src={template.image} 
                  alt={template.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                {/* Title overlay on image */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                  padding: "50px 12px 12px",
                }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#fff",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    marginBottom: "4px",
                  }}>
                    {template.title}
                  </div>
                  <div style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.8)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    lineHeight: 1.3,
                  }}>
                    {template.description}
                  </div>
                </div>
                
                {/* Category badge */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  {template.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Generator Search */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "#fff", fontWeight: 600 }}>Genera con AI</div>
              <div style={{ fontSize: "11px", color: DS.textMut }}>Crea design in pochi secondi</div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: DS.textMut }}>
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Descrivi il design che vuoi creare..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${DS.border}`,
                borderRadius: "12px",
                padding: "12px 12px 12px 36px",
                color: DS.textPri,
                fontSize: "13px",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
            <button
              onClick={() => window.location.href = "/studio/ai-genera"}
              style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}>
              Genera
            </button>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
            {["volantino pizzeria", "menù ristorante", "saldi estivi", "evento musicale"].map((tag) => (
              <span key={tag} style={{ fontSize: "10px", color: DS.textMut, background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: "20px", cursor: "pointer" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section - 2 columns: Attività Recente & Design Recenti */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {/* Attività Recente */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Attività Recente</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { action: "Nuovo design creato", time: "2 min fa", color: DS.accent },
              { action: "Template scaricato", time: "1 ora fa", color: DS.green },
              { action: "Progetto modificato", time: "3 ore fa", color: "#F59E0B" },
              { action: "PDF esportato", time: "Ieri", color: DS.green },
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

        {/* Design Recenti */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Design Recenti</div>
            <Link href="/studio/design" style={{ fontSize: "12px", color: DS.accent, textDecoration: "none", fontWeight: 600 }}>Vedi tutti →</Link>
          </div>
          
          {recentProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Folder size={28} color={DS.textMut} style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ color: DS.textSec, fontSize: "12px", margin: 0 }}>Nessun design</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentProjects.slice(0, 4).map(p => (
                <Link key={p.id} href={`/editor/${p.id}`} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  textDecoration: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg,#1e293b,#0f172a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Edit3 size={14} color={DS.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: "10px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <Clock size={10} /> {new Date(p.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
