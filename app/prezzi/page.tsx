import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prezzi — GenCard",
  description: "Scegli il piano giusto per te. Inizia gratis e scala quando sei pronto con i piani Pro e Business di GenCard.",
};

export default function PrezziPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  void searchParams;
  return (
    <>
      <Header />
      <main style={{ paddingTop: "64px" }}>
        <div className="landing-section--tight" style={{ textAlign: "center", paddingBottom: "40px" }}>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}>
            Scegli il tuo <span className="gradient-text">piano</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto", padding: `0 var(--landing-pad-x)` }}>
            Tutti i piani includono l&apos;accesso all&apos;editor canvas. Nessuna sorpresa in fattura.
          </p>
        </div>
        <PricingSection />

        {/* FAQ */}
        <section className="landing-section--tight" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif",
            letterSpacing: "-0.02em", marginBottom: "clamp(24px, 5vw, 40px)", textAlign: "center",
          }}>
            Domande Frequenti
          </h2>
          {[
            {
              q: "Posso cancellare in qualsiasi momento?",
              a: "Sì, puoi cancellare il tuo abbonamento in qualsiasi momento. Continuerai ad avere accesso al piano Pro fino alla fine del periodo di fatturazione.",
            },
            {
              q: "I miei progetti sono al sicuro?",
              a: "Assolutamente. I tuoi progetti sono salvati in modo sicuro su Neon (PostgreSQL) e non vengono mai eliminati, anche se il tuo piano scade.",
            },
            {
              q: "Posso esportare in PDF con il piano gratuito?",
              a: "L'export PDF è disponibile solo per i piani Pro e Business. Con il piano gratuito puoi esportare in PNG ad alta risoluzione.",
            },
            {
              q: "Che metodi di pagamento accettate?",
              a: "Accettiamo tutte le principali carte di credito e debito tramite Stripe: Visa, Mastercard, American Express e altri.",
            },
          ].map((faq, i) => (
            <div key={i} style={{
              padding: "clamp(16px, 3vw, 20px) var(--landing-pad-x)", borderRadius: "12px",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              marginBottom: "12px",
            }}>
              <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{faq.q}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
