import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Zap, Check, Star } from "lucide-react";
import GithubMark from "@/components/icons/GithubMark";

export default async function AccediPage() {
  const session = await auth();
  if (session) redirect("/studio");

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", top: "-200px", left: "-200px",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        filter: "blur(100px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-200px", right: "-200px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        filter: "blur(100px)", pointerEvents: "none",
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: "960px",
        width: "100%",
        gap: "48px",
        alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* Left panel - Benefits */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "11px",
              background: "var(--gradient-main)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px var(--accent-glow)",
            }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Volantino<span className="gradient-text">AI</span>
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}>
            Crea volantini<br />
            <span className="gradient-text">professionali</span><br />
            in minuti
          </h1>

          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "36px" }}>
            Unisciti a migliaia di professionisti italiani che usano GenCard per promuovere il loro business.
          </p>

          {/* Benefits list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              "Editor canvas drag-and-drop professionale",
              "3 progetti gratis, nessuna carta richiesta",
              "Template bellissimi e personalizzabili",
              "Export PNG e PDF in alta risoluzione",
              "Salvataggio automatico su cloud",
            ].map((benefit, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Check size={12} color="var(--accent-light)" strokeWidth={3} />
                </div>
                <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{
            marginTop: "40px", padding: "16px 20px",
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ display: "flex" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>4.9/5</strong> — Valutazione media di 2.000+ utenti
            </span>
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className="glass" style={{ borderRadius: "20px", padding: "40px" }}>
          <h2 style={{
            fontSize: "22px", fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: "8px",
          }}>
            Accedi al tuo account
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px" }}>
            Usa il tuo account GitHub per iniziare subito
          </p>

          {/* GitHub login button */}
          <form action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/studio" });
          }}>
            <button type="submit" className="github-btn" style={{
              width: "100%", padding: "14px 24px",
              background: "#161b22", border: "1px solid #30363d",
              borderRadius: "12px", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              fontSize: "15px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}>
              <GithubMark size={20} />
              Continua con GitHub
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px",
            margin: "28px 0", color: "var(--text-muted)", fontSize: "13px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            In futuro disponibile anche con
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          {/* Disabled options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Continua con Google", emoji: "🔵", disabled: true },
              { label: "Continua con Email", emoji: "📧", disabled: true },
            ].map((opt, i) => (
              <button key={i} disabled style={{
                width: "100%", padding: "12px 20px",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "12px", color: "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                fontSize: "14px", cursor: "not-allowed", opacity: 0.5,
                fontFamily: "inherit",
              }}>
                {opt.emoji} {opt.label} — Prossimamente
              </button>
            ))}
          </div>

          {/* Terms */}
          <p style={{
            marginTop: "24px", fontSize: "12px", color: "var(--text-muted)",
            textAlign: "center", lineHeight: 1.6,
          }}>
            Accedendo accetti i nostri{" "}
            <a href="#" style={{ color: "var(--accent-light)" }}>Termini di Servizio</a>{" "}
            e la{" "}
            <a href="#" style={{ color: "var(--accent-light)" }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          main > div { grid-template-columns: 1fr !important; }
          main > div > div:first-child { display: none; }
        }
        .github-btn:hover { background: #21262d !important; }
      `}</style>
    </main>
  );
}
