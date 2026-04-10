"use client";
import { Crown, CreditCard, Link2, Shield, User as UserIcon, Check } from "lucide-react";
import { useDashboard } from "../DashboardContext";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", green: "#10B981", red: "#EF4444",
  textSec: "#94A3B8", textMut: "#475569",
};

const PLAN_LABEL: Record<string, string> = { FREE: "Gratuito", PRO: "Pro", BUSINESS: "Business" };
const PLAN_DESC: Record<string, string> = {
  FREE: "3 progetti, export PNG",
  PRO: "Progetti illimitati, export PDF",
  BUSINESS: "Tutto incluso + teams",
};

export default function ImpostazioniPage() {
  const { user, plan } = useDashboard();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Impostazioni</h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Gestisci il tuo account, abbonamento e integrazioni.</p>
      </div>

      {/* Account */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <UserIcon size={15} color={DS.accent} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Profilo Account</span>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg,${DS.accent},#8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{user.name || "—"}</div>
              <div style={{ fontSize: "13px", color: DS.textSec }}>{user.email}</div>
            </div>
          </div>
          {[{ label: "Nome", value: user.name || "—" }, { label: "Email", value: user.email || "—" }].map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "16px" }}>
              <label style={{ fontSize: "13px", color: DS.textSec, fontWeight: 500 }}>{f.label}</label>
              <input defaultValue={f.value} style={{ background: DS.bg, border: `1px solid ${DS.border}`, borderRadius: "8px", padding: "9px 14px", color: "#fff", fontSize: "13px", outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <CreditCard size={15} color={DS.accent} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Abbonamento</span>
        </div>
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{PLAN_LABEL[plan]}</div>
            <div style={{ fontSize: "13px", color: DS.textSec, marginTop: "4px" }}>{PLAN_DESC[plan]}</div>
          </div>
          {plan === "FREE" && (
            <a href="/prezzi" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `linear-gradient(135deg,${DS.accent},#8b5cf6)`, color: "#fff", textDecoration: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, fontSize: "13px" }}>
              <Crown size={15} /> Upgrade a Pro
            </a>
          )}
        </div>
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

      {/* Security */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={15} color={DS.accent} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Sicurezza</span>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[{ label: "Password attuale" }, { label: "Nuova password" }, { label: "Conferma password" }].map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: "16px" }}>
              <label style={{ fontSize: "13px", color: DS.textSec, fontWeight: 500 }}>{f.label}</label>
              <input type="password" placeholder="••••••••" style={{ background: DS.bg, border: `1px solid ${DS.border}`, borderRadius: "8px", padding: "9px 14px", color: "#fff", fontSize: "13px", outline: "none" }} />
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${DS.border}`, paddingTop: "16px" }}>
            <button style={{ background: `linear-gradient(135deg,${DS.accent},#8b5cf6)`, color: "#fff", border: "none", padding: "9px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
              Aggiorna Password
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "14px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: DS.red }}>Elimina Account</div>
          <div style={{ fontSize: "12px", color: DS.textSec, marginTop: "2px" }}>Questa azione è irreversibile e cancellerà tutti i dati.</div>
        </div>
        <button style={{ padding: "9px 20px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: DS.red, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          Elimina
        </button>
      </div>
    </div>
  );
}
