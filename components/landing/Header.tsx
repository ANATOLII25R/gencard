"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions/auth";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (authMode === "register") {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      
      const res = await registerUser(formData);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }
    }

    // Try to login (works for both direct login and after successful registration)
    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginRes?.error) {
      setError(authMode === "register" ? "Registrazione effettuata, ma login fallito." : "Email o password errati.");
      setIsLoading(false);
    } else {
      window.location.href = "/studio";
    }
  };

  return (
    <>
    <header className="landing-header" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      background: "rgba(10,10,15,0.85)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px", background: "var(--gradient-main)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px var(--accent-glow)",
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: "18px", fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Volantino<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {[
            { href: "#funzionalita", label: "Funzionalità" },
            { href: "#template", label: "Template" },
            { href: "/prezzi", label: "Prezzi" },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode("login"); setIsLoginOpen(true); }} style={{
            color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", fontWeight: 500,
            padding: "8px 16px", borderRadius: "8px", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Accedi
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode("register"); setIsLoginOpen(true); }} className="btn-primary" style={{ padding: "8px 20px", fontSize: "14px", borderRadius: "10px", textDecoration: "none" }}>
            Inizia Gratis <ArrowRight size={16} />
          </a>
          <button
            style={{ display: "none", background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
            className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
          padding: "16px var(--landing-pad-x, 16px)", display: "flex", flexDirection: "column", gap: "16px",
        }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); setAuthMode("register"); setIsLoginOpen(true); }} className="btn-primary" style={{ textAlign: "center", justifyContent: "center", textDecoration: "none" }}>
            Inizia Gratis <ArrowRight size={16} />
          </a>
          {[
            { action: "funz", label: "Funzionalità" },
            { action: "prezzi", label: "Prezzi" },
            { action: "login", label: "Accedi" },
          ].map((item) => (
            <a key={item.label} href={item.action === "funz" ? "#funzionalita" : item.action === "prezzi" ? "/prezzi" : "#"}
              style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "15px", textAlign: "center" }}
              onClick={(e) => { 
                if (item.action === "login") { e.preventDefault(); setAuthMode("login"); setIsLoginOpen(true); }
                setMobileOpen(false); 
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

    </header>

      {/* Auth Modal Overlay (Moved outside Header to fix backdrop-filter position:fixed bug) */}
      {isLoginOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", // Denser background to obscure text
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }} onClick={() => setIsLoginOpen(false)}>
          
          <div className="animate-fade-in landing-auth-modal" style={{
            width: "100%", maxWidth: "420px", borderRadius: "20px",
            position: "relative",
            background: "rgba(22, 22, 31, 0.98)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(99, 102, 241, 0.15)", 
          }} onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setIsLoginOpen(false)} style={{
              position: "absolute", top: "16px", right: "16px",
              background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer"
            }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "6px", color: "white" }}>
              {authMode === "login" ? "Accedi all'account" : "Crea un account"}
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "28px" }}>
              {authMode === "login" ? "Bentornato! Continua per visualizzare i tuoi volantini." : "Unisciti a noi e crea il tuo primo design gratis."}
            </p>

            {/* Error badge */}
            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              {authMode === "register" && (
                <input
                  type="text" placeholder="Nome o Compagnia" required value={name} onChange={e => setName(e.target.value)}
                  className="input-form-auth"
                />
              )}
              <input
                type="email" placeholder="Indirizzo Email" required value={email} onChange={e => setEmail(e.target.value)}
                className="input-form-auth"
              />
              <input
                type="password" placeholder="Password (min 6 caratteri)" required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                className="input-form-auth"
              />
              <button type="submit" className="submit-btn-auth" disabled={isLoading} style={{ marginTop: "8px" }}>
                {isLoading ? <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : null}
                {authMode === "login" ? "Accedi" : "Registrati e Inizia"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0", color: "#475569", fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>
              <div style={{ flex: 1, height: "1px", background: "#1E2235" }} />
              Oppure connettiti con
              <div style={{ flex: 1, height: "1px", background: "#1E2235" }} />
            </div>

            <button onClick={() => signIn("github", { callbackUrl: "/studio" })} className="github-btn-header" style={{
              width: "100%", padding: "12px 24px", background: "#161b22", border: "1px solid #30363d",
              borderRadius: "10px", color: "white", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
              GitHub
            </button>

            <p style={{ marginTop: "24px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>
              {authMode === "login" ? "Non hai un account? " : "Hai già un account? "}
              <button 
                onClick={(e) => { e.preventDefault(); setAuthMode(authMode === "login" ? "register" : "login"); setError(""); }} 
                style={{ color: "#6366f1", background: "none", border: "none", fontWeight: 600, cursor: "pointer", padding: 0 }}
              >
                {authMode === "login" ? "Registrati gratis" : "Accedi qui"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
