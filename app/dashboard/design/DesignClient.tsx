"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Folder, Trash2, Edit3, Clock, Grid, List, Eye,
} from "lucide-react";
import type { Project, PlanType } from "@/types";

const DS = {
  bg: "#080B12", card: "#111827", cardHov: "#161E2E", border: "#1E293B",
  accent: "#6366F1", accentGl: "rgba(99,102,241,0.15)", green: "#10B981",
  red: "#EF4444", textPri: "#F8FAFC", textSec: "#94A3B8", textMut: "#475569",
};

interface Props {
  projects: Project[];
  plan: PlanType;
}

export default function DesignClient({ projects, plan }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const isAtLimit = plan === "FREE" && projects.length >= 3;

  const createProject = async () => {
    if (isAtLimit) { router.push("/prezzi"); return; }
    setCreating(true);
    const res = await fetch("/api/progetti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Nuovo Design", width: 800, height: 600 }),
    });
    const proj = await res.json();
    setCreating(false);
    if (proj.id) router.push(`/editor/${proj.id}`);
  };

  const deleteProject = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/progetti/${id}`, { method: "DELETE" });
    setDeletingId(null);
    startTransition(() => router.refresh());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.01em" }}>I miei Design</h2>
          <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>{projects.length} progetti salvati</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setViewMode("grid")} style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${viewMode === "grid" ? DS.accent : DS.border}`, background: viewMode === "grid" ? DS.accentGl : DS.card, color: viewMode === "grid" ? "#fff" : DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Grid size={14} />
          </button>
          <button onClick={() => setViewMode("list")} style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${viewMode === "list" ? DS.accent : DS.border}`, background: viewMode === "list" ? DS.accentGl : DS.card, color: viewMode === "list" ? "#fff" : DS.textSec, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div style={{ background: DS.card, border: `2px dashed ${DS.border}`, borderRadius: "16px", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", background: DS.accentGl, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Folder size={28} color={DS.accent} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Nessun design ancora</h3>
          <p style={{ color: DS.textSec, maxWidth: "360px", margin: "0 auto 24px", fontSize: "14px" }}>Crea il tuo primo progetto o scegli un template per iniziare.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={createProject} style={{ background: `linear-gradient(135deg, ${DS.accent}, #8b5cf6)`, color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Crea Design
            </button>
            <button onClick={() => router.push("/dashboard/template")} style={{ background: DS.card, color: DS.textSec, border: `1px solid ${DS.border}`, padding: "10px 24px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
              Scegli Template
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        // Grid view
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {projects.map(proj => (
            <div key={proj.id} style={{ borderRadius: "14px", overflow: "hidden", background: DS.card, border: `1px solid ${DS.border}`, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div onClick={() => router.push(`/editor/${proj.id}`)} style={{ height: "170px", cursor: "pointer", background: "linear-gradient(135deg,#1e293b,#0f172a)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {proj.thumbnail
                  ? <img src={proj.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Edit3 size={40} color={DS.accent} style={{ opacity: 0.4 }} />
                }
              </div>
              <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ overflow: "hidden" }}>
                  <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.name}</h4>
                  <span style={{ fontSize: "11px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={10} /> {new Date(proj.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => router.push(`/editor/${proj.id}`)} style={{ width: "30px", height: "30px", borderRadius: "7px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = DS.accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
                    <Eye size={13} />
                  </button>
                  <button onClick={() => deleteProject(proj.id)} style={{ width: "30px", height: "30px", borderRadius: "6px", background: "transparent", border: `1px solid ${DS.border}`, color: deletingId === proj.id ? DS.red : DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = DS.red; e.currentTarget.style.color = DS.red; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.textSec; }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 80px", padding: "12px 20px", background: DS.bg, borderBottom: `1px solid ${DS.border}`, fontSize: "11px", fontWeight: 700, color: DS.textMut, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>Nome</span><span>Modificato</span><span>Azioni</span>
          </div>
          {projects.map(p => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 80px", padding: "14px 20px", borderBottom: `1px solid ${DS.border}`, alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = DS.cardHov)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(99,102,241,0.1)", border: `1px solid ${DS.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Edit3 size={14} color={DS.accent} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              </div>
              <div style={{ fontSize: "12px", color: DS.textSec }}>{new Date(p.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => router.push(`/editor/${p.id}`)} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Eye size={12} />
                </button>
                <button onClick={() => deleteProject(p.id)} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: `1px solid ${DS.border}`, color: DS.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
