import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PricingSection from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marco Ferretti",
    role: "Proprietario Pizzeria",
    text: "Ho creato il mio volantino per l'apertura in 10 minuti. Prima spendevo €80 ogni volta da un grafico!",
    avatar: "MF",
    color: "#7c3aed",
  },
  {
    name: "Sofia Bianchi",
    role: "Event Planner",
    text: "I template sono bellissimi e professionali. I miei clienti pensano che li abbia fatti un designer.",
    avatar: "SB",
    color: "#2563eb",
  },
  {
    name: "Luca Romano",
    role: "Personal Trainer",
    text: "Uso GenCard ogni settimana per promuovere le mie classi. Facile, veloce e i risultati sono ottimi!",
    avatar: "LR",
    color: "#059669",
  },
];

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />

      {/* Testimonials */}
      <section className="landing-section" style={{ background: "var(--bg-primary)" }}>
        <div className="landing-container--narrow">
          <div style={{ textAlign: "center" }} className="landing-section-head">
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}>
              Cosa dicono i nostri <span className="gradient-text">clienti</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              Migliaia di professionisti italiani ci scelgono ogni giorno
            </p>
          </div>

          <div className="landing-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass card-hover" style={{ borderRadius: "16px", padding: "clamp(20px, 4vw, 28px)" }}>
                <Quote size={28} style={{ color: "var(--border-light)", marginBottom: "16px" }} />
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 700, color: "white",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Final CTA */}
      <section
        className="landing-section"
        style={{
          background: "var(--bg-primary)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: `0 var(--landing-pad-x)` }}>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.03em",
            marginBottom: "20px",
          }}>
            Pronto a creare<br />
            <span className="gradient-text">volantini straordinari?</span>
          </h2>
          <p className="landing-cta-sub" style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
            Inizia gratis oggi. Nessuna carta di credito richiesta.
          </p>
          <Link href="/accedi" className="btn-primary" style={{ padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)", fontSize: "clamp(15px, 3.5vw, 18px)" }}>
            Inizia Gratis Ora <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
