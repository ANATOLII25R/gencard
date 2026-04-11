"use client";
import { Check, Zap, Crown, Star } from "lucide-react";
import { PLANS } from "@/lib/stripe";
import { useRouter } from "next/navigation";

const PLAN_META = {
  FREE: { icon: <Star size={20} />, popular: false, badge: null },
  PRO: { icon: <Zap size={20} />, popular: true, badge: "Più Scelto" },
  BUSINESS: { icon: <Crown size={20} />, popular: false, badge: null },
};

export default function PricingSection() {
  const router = useRouter();

  return (
    <section id="prezzi" className="landing-section" style={{ background: "var(--bg-secondary)" }}>
      <div className="landing-container--narrow">
        {/* Header */}
        <div style={{ textAlign: "center" }} className="landing-section-head">
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}>
            Prezzi <span className="gradient-text">Semplici e Trasparenti</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "var(--text-secondary)", padding: `0 var(--landing-pad-x)` }}>
            Inizia gratis. Scala quando sei pronto.
          </p>
        </div>

        {/* Cards */}
        <div className="landing-pricing-grid">
          {Object.entries(PLANS).map(([key, plan]) => {
            const meta = PLAN_META[key as keyof typeof PLAN_META];
            const isPro = key === "PRO";

            return (
              <div
                key={key}
                className={isPro ? "landing-pricing-card--pro" : undefined}
                style={{
                borderRadius: "20px",
                padding: "clamp(22px, 4vw, 32px)",
                position: "relative",
                border: isPro ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: isPro
                  ? "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(37,99,235,0.05) 100%)"
                  : "var(--bg-card)",
                boxShadow: isPro ? "0 20px 60px rgba(124,58,237,0.2)" : "none",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => { if (!isPro) (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)"; }}
                onMouseLeave={(e) => { if (!isPro) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                {meta.badge && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "var(--gradient-main)",
                    color: "white", fontSize: "12px", fontWeight: 700,
                    padding: "4px 16px", borderRadius: "20px",
                    whiteSpace: "nowrap",
                  }}>
                    {meta.badge}
                  </div>
                )}

                {/* Plan header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: isPro ? "var(--gradient-main)" : "var(--bg-card-hover)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isPro ? "white" : "var(--text-secondary)",
                  }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700 }}>{plan.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {key === "FREE" ? "Per iniziare" : key === "PRO" ? "Per professionisti" : "Per team"}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontSize: "44px", fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      €{plan.price}
                    </span>
                    <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>/mese</span>
                  </div>
                  {plan.price > 0 && (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                      = €{(plan.price * 12).toFixed(0)}/anno fatturati mensilmente
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  className={isPro ? "btn-primary" : "btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", marginBottom: "28px" }}
                  onClick={() => {
                    if (plan.price === 0) {
                      router.push("/accedi");
                    } else {
                      router.push(`/prezzi?piano=${key.toLowerCase()}`);
                    }
                  }}
                >
                  {plan.price === 0 ? "Inizia Gratis" : `Inizia con ${plan.name}`}
                </button>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: isPro ? "rgba(124,58,237,0.2)" : "rgba(16,185,129,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Check size={12} color={isPro ? "var(--accent-light)" : "var(--success)"} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: "center", marginTop: "48px", color: "var(--text-muted)", fontSize: "14px" }}>
          ✅ Nessuna carta di credito richiesta · Annulla in qualsiasi momento · Supporto 24/7
        </div>
      </div>
    </section>
  );
}
