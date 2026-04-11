"use client";
import { useState } from "react";
import { UploadCloud, Upload } from "lucide-react";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", accentGl: "rgba(99,102,241,0.15)",
  blue: "#3B82F6", green: "#10B981", orange: "#F59E0B",
  textSec: "#94A3B8", textMut: "#475569",
};

const ASSETS = [
  { name: "logo-azienda.png",     type: "img",  size: "245 KB", date: "Ieri",             preview: "🖼️" },
  { name: "sfondo-natalizio.jpg", type: "img",  size: "1.2 MB", date: "3 giorni fa",      preview: "🌟" },
  { name: "icone-social.svg",     type: "icon", size: "48 KB",  date: "Una settimana fa", preview: "⬦"  },
  { name: "Inter-Bold.ttf",       type: "font", size: "320 KB", date: "2 settimane fa",   preview: "Aa" },
  { name: "Plus-Jakarta.ttf",     type: "font", size: "280 KB", date: "2 settimane fa",   preview: "Aa" },
  { name: "pattern-geo.png",      type: "img",  size: "92 KB",  date: "3 settimane fa",   preview: "⬡"  },
];

export default function UploadPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ASSETS : ASSETS.filter(a => a.type === filter);

  const typeColor = (t: string) =>
    t === "img" ? { text: DS.blue, bg: "rgba(59,130,246,0.1)" } :
    t === "font" ? { text: DS.green, bg: "rgba(16,185,129,0.1)" } :
    { text: DS.orange, bg: "rgba(245,158,11,0.1)" };

  return (
    <div className="studio-page">
      {/* Header */}
      <div className="studio-upload-header">
        <div>
          <h2 className="studio-page-title" style={{ fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Upload & Risorse</h2>
          <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Logo, immagini, icone e font personali.</p>
        </div>
        <button style={{ background: `linear-gradient(135deg,${DS.accent},#8b5cf6)`, color: "#fff", border: "none", padding: "9px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Upload size={15} /> Carica File
        </button>
      </div>

      {/* Drop Zone */}
      <div style={{ border: `2px dashed ${DS.border}`, borderRadius: "14px", padding: "40px", textAlign: "center", background: DS.card, cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.background = DS.accentGl; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.background = DS.card; }}>
        <UploadCloud size={36} color={DS.textMut} style={{ margin: "0 auto 12px", display: "block" }} />
        <p style={{ color: DS.textSec, margin: "0 0 4px", fontSize: "14px", fontWeight: 600 }}>Trascina file qui o clicca per caricare</p>
        <p style={{ color: DS.textMut, margin: 0, fontSize: "12px" }}>PNG, JPG, SVG, TTF — Max 10MB per file</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[{ v: "all", l: "Tutti" }, { v: "img", l: "Immagini" }, { v: "icon", l: "Icone" }, { v: "font", l: "Font" }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} style={{ padding: "6px 16px", borderRadius: "20px", border: `1px solid ${filter === f.v ? DS.accent : DS.border}`, background: filter === f.v ? DS.accent : DS.card, color: filter === f.v ? "#fff" : DS.textSec, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div className="studio-table-scroll" style={{ maxWidth: "100%" }}>
          <div className="studio-asset-grid">
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 100px 140px 100px", padding: "12px 16px", background: DS.bg, borderBottom: `1px solid ${DS.border}`, fontSize: "11px", fontWeight: 700, color: DS.textMut, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <span /><span>Nome</span><span>Tipo</span><span>Caricato</span><span>Dimensione</span>
        </div>
        {filtered.map((a, i) => {
          const c = typeColor(a.type);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr 100px 140px 100px", padding: "14px 16px", borderBottom: `1px solid ${DS.border}`, alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: "36px", height: "36px", background: DS.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", border: `1px solid ${DS.border}` }}>{a.preview}</div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{a.name}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: c.text, background: c.bg, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase", width: "fit-content" }}>
                {a.type === "img" ? "IMG" : a.type === "icon" ? "SVG" : "FONT"}
              </span>
              <span style={{ fontSize: "12px", color: DS.textSec }}>{a.date}</span>
              <span style={{ fontSize: "12px", color: DS.textMut }}>{a.size}</span>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}
