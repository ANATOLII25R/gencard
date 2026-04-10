"use client";
import { Type, Image, Shapes, Download, Undo, Layers, Palette, Zap, Shield, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: <Type size={24} />,
    title: "Editor di Testo Avanzato",
    description: "Centinaio di font, dimensioni, colori e stili. Trasforma qualsiasi testo in arte tipografica.",
    color: "#7c3aed",
  },
  {
    icon: <Shapes size={24} />,
    title: "Forme e Grafica",
    description: "Rettangoli, cerchi, triangoli, linee e molto altro. Crea layout professionali con pochi click.",
    color: "#2563eb",
  },
  {
    icon: <Image size={24} />,
    title: "Upload Immagini",
    description: "Carica le tue foto o scegli dai nostri template. Ridimensiona e ruota con precisione assoluta.",
    color: "#059669",
  },
  {
    icon: <Layers size={24} />,
    title: "Gestione Livelli",
    description: "Organizza gli elementi del tuo design con il pannello livelli drag-and-drop intuitivo.",
    color: "#d97706",
  },
  {
    icon: <Undo size={24} />,
    title: "Undo / Redo Illimitato",
    description: "Non avere paura di sbagliare. Cronologia completa delle modifiche sempre disponibile.",
    color: "#dc2626",
  },
  {
    icon: <Download size={24} />,
    title: "Export PNG e PDF",
    description: "Esporta i tuoi volantini in alta risoluzione per la stampa o la condivisione digitale.",
    color: "#7c3aed",
  },
  {
    icon: <Palette size={24} />,
    title: "Palette Colori",
    description: "Color picker avanzato con colori personalizzati, gradienti e palette salvate.",
    color: "#db2777",
  },
  {
    icon: <Zap size={24} />,
    title: "Salvataggio Automatico",
    description: "Non perdere mai il tuo lavoro. Il tuo progetto viene salvato automaticamente ogni modifica.",
    color: "#0891b2",
  },
  {
    icon: <Shield size={24} />,
    title: "Sicuro e Privato",
    description: "I tuoi design sono privati e protetti. Backup automatico su cloud con crittografia.",
    color: "#059669",
  },
];

export default function Features() {
  return (
    <section id="funzionalita" style={{ padding: "120px 24px", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: "20px", padding: "6px 16px", marginBottom: "20px",
            fontSize: "13px", color: "#60a5fa", fontWeight: 500,
          }}>
            <Globe size={14} />
            Funzionalità Complete
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}>
            Tutto ciò che ti serve<br />
            <span className="gradient-text">in un solo posto</span>
          </h2>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
            Strumenti professionali pensati per chi non ha tempo da perdere.
          </p>
        </div>

        {/* Features grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}>
          {FEATURES.map((feature, i) => (
            <div key={i} className="glass card-hover" style={{
              borderRadius: "16px",
              padding: "28px",
              display: "flex", flexDirection: "column", gap: "14px",
              cursor: "default",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: `${feature.color}20`,
                border: `1px solid ${feature.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: feature.color,
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: "16px", fontWeight: 700, marginBottom: "8px",
                  color: "var(--text-primary)",
                }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
