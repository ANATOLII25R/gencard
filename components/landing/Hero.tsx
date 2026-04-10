"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

const FLOATING_ELEMENTS = [
  { emoji: "🎨", top: "20%", left: "8%", delay: "0s" },
  { emoji: "✨", top: "15%", right: "10%", delay: "0.5s" },
  { emoji: "🖼️", top: "70%", left: "5%", delay: "1s" },
  { emoji: "📐", top: "65%", right: "8%", delay: "1.5s" },
  { emoji: "🎭", top: "40%", left: "3%", delay: "2s" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      paddingTop: "80px",
    }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", top: "-200px", left: "-100px",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-200px", right: "-100px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      {/* Floating emojis */}
      {mounted && FLOATING_ELEMENTS.map((el, i) => (
        <div key={i} style={{
          position: "absolute",
          top: el.top, left: el.left, right: (el as { right?: string }).right,
          fontSize: "28px",
          opacity: 0.4,
          animation: `float 3s ease-in-out infinite`,
          animationDelay: el.delay,
          zIndex: 1,
          pointerEvents: "none",
        }}>
          {el.emoji}
        </div>
      ))}

      {/* Content */}
      <div style={{
        maxWidth: "900px", margin: "0 auto", padding: "0 24px",
        textAlign: "center", position: "relative", zIndex: 2,
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "20px", padding: "6px 16px", marginBottom: "32px",
          fontSize: "13px", color: "var(--accent-light)", fontWeight: 500,
        }} className="animate-fade-in">
          <Sparkles size={14} />
          Editor Canvas Professionale Gratuito
          <Sparkles size={14} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(40px, 7vw, 80px)",
          fontWeight: 900,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.05,
          marginBottom: "24px",
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
        }} className="animate-fade-in">
          Crea Volantini{" "}
          <span className="gradient-text">Straordinari</span>
          <br />in Pochi Minuti
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "var(--text-secondary)",
          maxWidth: "600px", margin: "0 auto 48px",
          lineHeight: 1.7,
        }} className="animate-fade-in">
          L&apos;editor drag-and-drop professionale per creare volantini, poster e grafiche
          per il tuo business. <strong style={{ color: "var(--text-primary)" }}>Nessun design necessario.</strong>
        </p>

        {/* Social proof */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "16px", marginBottom: "40px",
        }}>
          <div style={{ display: "flex" }}>
            {["👤", "👤", "👤", "👤", "👤"].map((_, i) => (
              <div key={i} style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: `hsl(${260 + i * 20}, 70%, ${40 + i * 5}%)`,
                border: "2px solid var(--bg-primary)",
                marginLeft: i > 0 ? "-8px" : "0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
              }}>
                {i + 1}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Usato da +2.000 professionisti
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/accedi" className="btn-primary animate-pulse-glow" style={{ padding: "14px 32px", fontSize: "16px" }}>
            Inizia Gratis <ArrowRight size={18} />
          </Link>
          <button className="btn-secondary" style={{ padding: "14px 32px", fontSize: "16px" }}
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Play size={16} fill="currentColor" /> Guarda Demo
          </button>
        </div>

        {/* Preview mockup */}
        <div id="demo" style={{
          marginTop: "80px", borderRadius: "20px", overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)",
          position: "relative",
        }}>
          {/* Fake editor UI */}
          <div style={{
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 20px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
              VolantinoAI — Editor
            </span>
          </div>
          <div style={{
            background: "var(--bg-card)",
            height: "420px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "16px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Fake canvas */}
            <div style={{
              width: "280px", height: "360px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "12px", padding: "30px",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "20px", left: "20px", right: "20px",
                height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px",
              }} />
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px",
              }}>🎉</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white", lineHeight: 1.2 }}>GRAN APERTURA</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Sabato 15 Aprile</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.9)", color: "#764ba2",
                padding: "8px 20px", borderRadius: "20px",
                fontSize: "13px", fontWeight: 700,
              }}>Scopri di più →</div>
              <div style={{ position: "absolute", bottom: "15px", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                Via Roma 42 · Milano
              </div>
            </div>
            {/* Floating tools */}
            <div style={{
              position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", gap: "8px",
            }}>
              {["T", "⬜", "⭕", "🖼️", "🎨"].map((tool, i) => (
                <div key={i} style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: i === 0 ? "var(--accent)" : "var(--bg-card-hover)",
                  border: "1px solid var(--border-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 700, color: "white", cursor: "pointer",
                }}>
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
