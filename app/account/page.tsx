import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import { PLANS } from "@/lib/stripe";
import Link from "next/link";
import { ArrowLeft, Crown, CreditCard, User, Calendar, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account — GenCard",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/accedi");

  const [subscription, projectCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.project.count({ where: { userId: session.user.id } }),
  ]);

  const plan = subscription?.plan ?? "FREE";
  const planInfo = PLANS[plan];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "0 24px 60px" }}>
      {/* Header */}
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        padding: "24px 0 32px",
        display: "flex", alignItems: "center", gap: "16px",
        borderBottom: "1px solid var(--border)", marginBottom: "40px",
      }}>
        <Link href="/studio" style={{
          display: "flex", alignItems: "center", gap: "6px",
          color: "var(--text-secondary)", textDecoration: "none",
          fontSize: "14px", padding: "6px 12px", borderRadius: "8px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          transition: "all 0.2s",
        }}>
          <ArrowLeft size={15} /> Studio
        </Link>
        <h1 style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Il mio Account
        </h1>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Profile card */}
        <div className="glass" style={{ borderRadius: "16px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "var(--gradient-main)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              overflow: "hidden",
            }}>
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={28} color="white" />
              )}
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>{session.user.name}</div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{session.user.email}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { label: "Progetti Creati", value: projectCount, icon: "📁" },
              { label: "Piano Attuale", value: planInfo.name, icon: "⭐" },
              { label: "Membro dal", value: new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" }), icon: "📅" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: "16px", borderRadius: "12px",
                background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{stat.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription card */}
        <div className="glass" style={{ borderRadius: "16px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CreditCard size={20} color="var(--accent-light)" />
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Abbonamento</h2>
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 12px", borderRadius: "20px",
              background: plan === "FREE" ? "rgba(96,96,117,0.2)" : "rgba(124,58,237,0.2)",
              color: plan === "FREE" ? "var(--text-muted)" : "var(--accent-light)",
              border: `1px solid ${plan === "FREE" ? "var(--border)" : "rgba(124,58,237,0.4)"}`,
              fontSize: "12px", fontWeight: 700,
            }}>
              {plan !== "FREE" && <Crown size={12} />}
              Piano {planInfo.name}
            </span>
          </div>

          {plan === "FREE" ? (
            <div style={{
              padding: "20px", borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.08))",
              border: "1px solid rgba(124,58,237,0.3)",
            }}>
              <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>
                🚀 Sblocca più funzionalità con Pro
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
                Progetti illimitati, export PDF, tutti i template e supporto prioritario.
                Solo €9/mese.
              </div>
              <Link href="/prezzi" className="btn-primary" style={{ display: "inline-flex" }}>
                Passa a Pro <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {subscription?.stripeCurrentPeriodEnd && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  <Calendar size={15} />
                  Rinnovo: {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Per gestire o cancellare il tuo abbonamento, contatta il supporto.
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button type="submit" style={{
            padding: "12px 24px", borderRadius: "10px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", fontSize: "14px", fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
          >
            🚪 Disconnetti
          </button>
        </form>
      </div>
    </div>
  );
}
