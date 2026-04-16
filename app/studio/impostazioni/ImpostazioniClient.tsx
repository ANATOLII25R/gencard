"use client";
import { Link2, Check } from "lucide-react";
import type { PlanType } from "@/types";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", green: "#10B981", red: "#EF4444",
  textSec: "#94A3B8", textMut: "#475569",
};

interface Props {
  user: { id?: string; name?: string | null; email?: string | null };
  plan: PlanType;
}

export default function ImpostazioniClient({ user, plan }: Props) {
  return (
    <div className="studio-page">
      <div>
        <h2 className="studio-page-title" style={{ fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Impostazioni</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Gestisci le integrazioni e le impostazioni del sistema.</p>
      </div>

      {/* Integrations */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <Link2 size={15} color={DS.accent} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Integrazioni</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { name: "GitHub OAuth", icon: "⬛", desc: "Login con GitHub",        connected: true  },
            { name: "Stripe",       icon: "💳", desc: "Pagamenti e abbonamenti", connected: false },
            { name: "Google OAuth", icon: "🔵", desc: "Login con Google",        connected: false },
          ].map((int, i) => (
            <div key={i} style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: DS.bg, border: `1px solid ${DS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{int.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{int.name}</div>
                <div style={{ fontSize: "12px", color: DS.textSec }}>{int.desc}</div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: int.connected ? DS.green : DS.textMut, background: int.connected ? "rgba(16,185,129,0.1)" : DS.bg, border: `1px solid ${int.connected ? "rgba(16,185,129,0.3)" : DS.border}`, padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
                {int.connected && <Check size={10} />}{int.connected ? "Connesso" : "Non connesso"}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
