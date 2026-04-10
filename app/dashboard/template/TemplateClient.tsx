"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", green: "#10B981", textSec: "#94A3B8", textMut: "#475569",
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

const CATS = ["Tutti", "Retail", "Events", "Food", "Promo", "Education", "Social", "Art"];

export default function TemplateClient() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Tutti");
  const [creating, setCreating] = useState(false);

  const filtered = activeFilter === "Tutti" ? TEMPLATES : TEMPLATES.filter(t => t.cat === activeFilter);

  const createFromTemplate = async (tpl: typeof TEMPLATES[0]) => {
    setCreating(true);
    const res = await fetch("/api/progetti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tpl.name, width: tpl.w, height: tpl.h }),
    });
    const proj = await res.json();
    setCreating(false);
    if (proj.id) router.push(`/editor/${proj.id}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Template Pronti</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Scegli un punto di partenza e personalizzalo con l&apos;editor.</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} style={{ padding: "6px 16px", borderRadius: "20px", border: `1px solid ${activeFilter === cat ? DS.accent : DS.border}`, background: activeFilter === cat ? DS.accent : DS.card, color: activeFilter === cat ? "#fff" : DS.textSec, fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {filtered.map((tpl, i) => (
          <div key={i} onClick={() => !creating && createFromTemplate(tpl)} style={{ borderRadius: "14px", background: DS.card, border: `1px solid ${DS.border}`, cursor: creating ? "wait" : "pointer", overflow: "hidden", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: "140px", background: tpl.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", position: "relative" }}>
              {tpl.emoji}
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.4)", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#fff" }}>{tpl.cat}</div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{tpl.name}</div>
              <div style={{ fontSize: "11px", color: DS.textMut }}>Formato: {tpl.w}×{tpl.h}px</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
