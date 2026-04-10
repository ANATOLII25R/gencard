"use client";
import { Check } from "lucide-react";

const DS = {
  card: "#111827", border: "#1E293B", accent: "#6366F1",
  green: "#10B981", textSec: "#94A3B8", textMut: "#475569",
};

const INTEGRATIONS = [
  { name: "GitHub OAuth",  icon: "⬛", desc: "Login con GitHub",           status: true  },
  { name: "Stripe",        icon: "💳", desc: "Pagamenti e abbonamenti",    status: false },
  { name: "Google OAuth",  icon: "🔵", desc: "Login con Google",           status: false },
  { name: "Slack",         icon: "💬", desc: "Notifiche team via Slack",   status: false },
  { name: "Zapier",        icon: "⚡", desc: "Automazione flussi di lavoro", status: false },
  { name: "Webhooks",      icon: "🔗", desc: "Endpoint personalizzati",    status: false },
];

export default function IntegrazioniPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Integrazioni API</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Connetti i tuoi servizi preferiti a GenCard.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {INTEGRATIONS.map((int, i) => (
          <div key={i} style={{ background: DS.card, border: `1px solid ${int.status ? "rgba(16,185,129,0.3)" : DS.border}`, borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = int.status ? "rgba(16,185,129,0.3)" : DS.border; }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${DS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{int.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{int.name}</div>
                <div style={{ fontSize: "12px", color: DS.textSec }}>{int.desc}</div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: int.status ? DS.green : DS.textMut, background: int.status ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${int.status ? "rgba(16,185,129,0.3)" : DS.border}`, padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                {int.status && <Check size={10} />}{int.status ? "Connesso" : "Non connesso"}
              </span>
            </div>
            <button style={{ width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${int.status ? "rgba(16,185,129,0.3)" : DS.border}`, background: int.status ? "rgba(16,185,129,0.08)" : "transparent", color: int.status ? DS.green : DS.textSec, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              {int.status ? "✓ Connesso" : "Connetti"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
