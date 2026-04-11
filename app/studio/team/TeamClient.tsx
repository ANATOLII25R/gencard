"use client";
import { Users } from "lucide-react";

const DS = { card: "#111827", border: "#1E293B", orange: "#F59E0B", textSec: "#94A3B8" };

export default function TeamClient() {
  return (
    <div className="studio-page">
      <div>
        <h2 className="studio-page-title" style={{ fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Team & Utenti</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Collaborazione e gestione team disponibile nel piano Business.</p>
      </div>
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "16px", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", background: "rgba(245,158,11,0.1)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Users size={32} color={DS.orange} />
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Funzione Teams in Arrivo</h3>
        <p style={{ color: DS.textSec, maxWidth: "400px", margin: "0 auto 28px", fontSize: "14px", lineHeight: 1.7 }}>
          Presto potrai invitare collaboratori, assegnare ruoli e gestire le risorse condivise del tuo team.
        </p>
        <a href="/prezzi" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg,#F59E0B,#ec4899)", color: "#fff", textDecoration: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 20px rgba(245,158,11,0.3)" }}>
          Guarda i Piani
        </a>
      </div>
    </div>
  );
}
