import { Globe, Layers, FileImage, Package, Type, Image as ImageIcon } from "lucide-react";

const DS = {
  card: "#111827", border: "#1E293B", accent: "#6366F1",
  green: "#10B981", orange: "#F59E0B",
  textSec: "#94A3B8", textMut: "#475569",
};

const PRODUCTS = [
  { icon: <FileImage size={28} />, title: "Volantini",    desc: "Promozioni, svendite, aperture. Stampa-pronti in alta risoluzione.",    status: "Attivo",  badge: DS.green  },
  { icon: <Package size={28} />,   title: "Poster",       desc: "A3, A2, A1. Design verticali per eventi, concerti e mostre.",           status: "Attivo",  badge: DS.green  },
  { icon: <Globe size={28} />,     title: "Social Media", desc: "Post e stories ottimizzati per Instagram, Facebook e TikTok.",          status: "Attivo",  badge: DS.green  },
  { icon: <Layers size={28} />,    title: "Brochure",     desc: "Pieghevoli, depliant e presentazioni aziendali multi-pagina.",          status: "Presto",  badge: DS.orange },
  { icon: <ImageIcon size={28} />, title: "Banner Web",   desc: "Banner digitali in tutti i formati standard per campagne display.",     status: "Presto",  badge: DS.orange },
  { icon: <Type size={28} />,      title: "Biglietti",    desc: "Biglietti da visita professionali fronte-retro, pronti per la stampa.", status: "Presto",  badge: DS.orange },
];

export default function ProdottiPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Prodotti & Poster</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Tipi di contenuto che puoi creare con GenCard.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {PRODUCTS.map((p, i) => (
          <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: "52px", height: "52px", background: `rgba(99,102,241,0.12)`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: DS.accent }}>
                {p.icon}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: p.badge === DS.green ? DS.green : DS.orange, background: p.badge === DS.green ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${p.badge === DS.green ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, padding: "3px 10px", borderRadius: "20px" }}>
                {p.status}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{p.title}</div>
              <div style={{ fontSize: "13px", color: DS.textSec, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
