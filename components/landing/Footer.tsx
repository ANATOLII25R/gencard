"use client";
import Link from "next/link";
import { Zap } from "lucide-react";

const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const Github = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-secondary)",
      borderTop: "1px solid var(--border)",
      padding: "64px 24px 32px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: "var(--gradient-main)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Zap size={18} color="white" fill="white" />
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                Volantino<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "280px" }}>
              L&apos;editor di volantini professionale per il tuo business. Design bellissimi in pochi minuti.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {[
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" },
                { icon: <Linkedin size={16} />, href: "#" },
                { icon: <Github size={16} />, href: "#" },
              ].map((social, i) => (
                <a key={i} href={social.href} style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Prodotto",
              links: [
                { label: "Funzionalità", href: "#funzionalita" },
                { label: "Template", href: "#template" },
                { label: "Prezzi", href: "/prezzi" },
                { label: "Aggiornamenti", href: "#" },
              ],
            },
            {
              title: "Risorse",
              links: [
                { label: "Documentazione", href: "#" },
                { label: "Tutorial Video", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Supporto", href: "#" },
              ],
            },
            {
              title: "Legale",
              links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Termini di Servizio", href: "#" },
                { label: "Cookie Policy", href: "#" },
                { label: "GDPR", href: "#" },
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map((link, j) => (
                  <Link key={j} href={link.href} style={{
                    fontSize: "14px", color: "var(--text-muted)", textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            © 2025 VolantinoAI. Tutti i diritti riservati.
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Fatto con ❤️ in Italia 🇮🇹
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
