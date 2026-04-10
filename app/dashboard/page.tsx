import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import {
  Eye, Users, Rocket, CreditCard, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, Edit3, Folder,
} from "lucide-react";
import Link from "next/link";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", green: "#10B981", red: "#EF4444",
  textPri: "#F8FAFC", textSec: "#94A3B8", textMut: "#475569",
};

const getRecentProjects = unstable_cache(
  async (userId: string) => prisma.project.findMany({
    where: { userId }, orderBy: { updatedAt: "desc" }, take: 5,
  }),
  ["recent-projects"],
  { revalidate: false, tags: ["projects"] }
);

function StatCard({ icon, title, value, change, positive }: { icon: React.ReactNode; title: string; value: string; change: string; positive: boolean }) {
  return (
    <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: DS.textSec, fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>{icon} {title}</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: positive ? DS.green : DS.red, background: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "2px" }}>
          {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {change}
        </span>
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, color: DS.textPri, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

export default async function PanoramicaPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const recentProjects = await getRecentProjects(session.user.id);
  const firstName = session.user.name?.split(" ")[0] || "Designer";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          Bentornato, <span style={{ background: `linear-gradient(90deg, ${DS.accent}, #a78bfa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{firstName}</span> 👋
        </h2>
        <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Ecco un riepilogo della tua attività recente.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <StatCard icon={<Eye size={13} />}        title="Pageviews"     value="50.8K" change="+28.4%" positive={true} />
        <StatCard icon={<Users size={13} />}      title="Utenti mese"   value="23.6K" change="-12.6%" positive={false} />
        <StatCard icon={<Rocket size={13} />}     title="Nuovi iscritti" value="756"  change="+3.1%"  positive={true} />
        <StatCard icon={<CreditCard size={13} />} title="Abbonamenti"   value="2.3K"  change="+11.3%" positive={true} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        {/* Revenue Chart */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", overflow: "hidden", position: "relative" }}>
          <div style={{ fontSize: "12px", color: DS.textSec, display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <TrendingUp size={13} /> Entrate totali
          </div>
          <div style={{ fontSize: "34px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "24px" }}>
            €240.8K <span style={{ fontSize: "14px", fontWeight: 600, background: "rgba(16,185,129,0.12)", color: DS.green, padding: "3px 8px", borderRadius: "20px", verticalAlign: "middle" }}>+24.6%</span>
          </div>
          {/* Bar chart mock */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? DS.accent : `rgba(99,102,241,${0.2 + i * 0.05})`, borderRadius: "4px 4px 0 0", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Attività Recente</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { action: "Nuovo design creato", time: "2 min fa", color: DS.accent },
              { action: "Template scaricato",  time: "1 ora fa", color: DS.green },
              { action: "Progetto modificato", time: "3 ore fa", color: "#F59E0B" },
              { action: "PDF esportato",        time: "Ieri",     color: DS.green },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#fff", fontWeight: 500 }}>{a.action}</div>
                  <div style={{ fontSize: "11px", color: DS.textMut }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Design Recenti</div>
          <Link href="/dashboard/design" style={{ fontSize: "12px", color: DS.accent, textDecoration: "none", fontWeight: 600 }}>Vedi tutti →</Link>
        </div>
        {recentProjects.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Folder size={32} color={DS.textMut} style={{ margin: "0 auto 12px" }} />
            <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Nessun design ancora. <Link href="/dashboard/design" style={{ color: DS.accent }}>Crea il tuo primo</Link></p>
          </div>
        ) : (
          recentProjects.map(p => (
            <Link key={p.id} href={`/editor/${p.id}`} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: `1px solid ${DS.border}`, textDecoration: "none", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg,#1e293b,#0f172a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Edit3 size={16} color={DS.accent} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <Clock size={10} /> {new Date(p.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
