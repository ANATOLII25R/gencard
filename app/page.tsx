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
      <section style={{ padding: "120px 24px", background: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
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

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass card-hover" style={{ borderRadius: "16px", padding: "28px" }}>
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
      <section style={{
        padding: "120px 24px",
        background: "var(--bg-primary)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
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
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "40px" }}>
            Inizia gratis oggi. Nessuna carta di credito richiesta.
          </p>
          <Link href="/accedi" className="btn-primary" style={{ padding: "16px 40px", fontSize: "18px" }}>
            Inizia Gratis Ora <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
