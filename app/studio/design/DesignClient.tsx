"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, Edit3, Trash2 } from "lucide-react";
import type { Project } from "@/types";

const DS = {
  bg: "#080B12", card: "#111827", border: "#1E293B",
  accent: "#6366F1", accentGl: "rgba(99,102,241,0.15)",
  textPri: "#F8FAFC", textSec: "#94A3B8", textMut: "#475569",
  red: "#EF4444", green: "#10B981",
};

interface Props {
  projects: Project[];
}

export default function DesignClient({ projects }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const completedProjects = projects.filter(p => p.status === "COMPLETED");
  const inProgressProjects = projects.filter(p => p.status === "IN_PROGRESS");

  const handleRename = async (projectId: string, newName: string) => {
    if (!newName.trim()) return;

    setLoading(projectId);
    try {
      const res = await fetch(`/api/progetti/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditingName("");
        startTransition(() => router.refresh());
      }
    } catch (error) {
      console.error("Rename error:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    setLoading(projectId);
    try {
      const res = await fetch(`/api/progetti/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingId(null);
        startTransition(() => router.refresh());
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(null);
    }
  };

  const ProjectCard = ({ proj }: { proj: Project }) => {
    const isEditing = editingId === proj.id;
    const isDeleting = deletingId === proj.id;
    const isLoading = loading === proj.id;

    return (
      <div
        key={proj.id}
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          background: DS.card,
          border: `1px solid ${DS.border}`,
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
        }}
        onMouseEnter={e => {
          if (!isEditing && !isDeleting) {
            e.currentTarget.style.borderColor = DS.accent;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = DS.border;
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Main card area */}
        <div onClick={() => !isEditing && !isDeleting && router.push(`/editor/${proj.id}`)}>
          <div style={{ height: "140px", background: "linear-gradient(135deg,#1e293b,#0f172a)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {proj.thumbnail
              ? <img src={proj.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Edit3 size={32} color={DS.accent} style={{ opacity: 0.4 }} />
            }
          </div>
        </div>

        {/* Info and actions */}
        <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleRename(proj.id, editingName);
                  } else if (e.key === "Escape") {
                    setEditingId(null);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: DS.bg,
                  border: `1px solid ${DS.accent}`,
                  borderRadius: "6px",
                  color: DS.textPri,
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  outline: "none",
                  marginBottom: "4px",
                }}
              />
            ) : (
              <h4 style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.name}</h4>
            )}
            <span style={{ fontSize: "11px", color: DS.textMut, display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={10} /> {new Date(proj.updatedAt).toLocaleDateString("it-IT", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {isEditing ? (
              <>
                <button
                  onClick={() => handleRename(proj.id, editingName)}
                  disabled={isLoading}
                  style={{
                    padding: "4px 8px",
                    background: DS.accent,
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    opacity: isLoading ? 0.6 : 1,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => !isLoading && (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => !isLoading && (e.currentTarget.style.opacity = "1")}
                >
                  Salva
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  disabled={isLoading}
                  style={{
                    padding: "4px 8px",
                    background: "transparent",
                    border: `1px solid ${DS.border}`,
                    borderRadius: "6px",
                    color: DS.textSec,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  Annulla
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setEditingId(proj.id);
                    setEditingName(proj.name);
                  }}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: `1px solid ${DS.border}`,
                    color: DS.textSec,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = DS.accent;
                    e.currentTarget.style.color = DS.accent;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = DS.border;
                    e.currentTarget.style.color = DS.textSec;
                  }}
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setDeletingId(proj.id);
                  }}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: `1px solid ${DS.border}`,
                    color: DS.textSec,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = DS.red;
                    e.currentTarget.style.color = DS.red;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = DS.border;
                    e.currentTarget.style.color = DS.textSec;
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {isDeleting && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px",
              textAlign: "center",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>
              Eliminare questo progetto?
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(proj.id);
                }}
                disabled={isLoading}
                style={{
                  padding: "4px 12px",
                  background: DS.red,
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                Sì, elimina
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setDeletingId(null);
                }}
                disabled={isLoading}
                style={{
                  padding: "4px 12px",
                  background: "transparent",
                  border: `1px solid ${DS.border}`,
                  borderRadius: "6px",
                  color: DS.textSec,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="studio-page">
      {/* I miei Design Section */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>I miei Design</h2>
          <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>{completedProjects.length} progetti salvati</p>
        </div>

        {completedProjects.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {completedProjects.map(proj => <ProjectCard key={proj.id} proj={proj} />)}
          </div>
        ) : (
          <div style={{ padding: "32px 20px", textAlign: "center", background: DS.card, border: `1px dashed ${DS.border}`, borderRadius: "12px", color: DS.textMut, fontSize: "13px" }}>
            Nessun design completato
          </div>
        )}
      </div>

      {/* In sviluppo Section */}
      <div>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>In sviluppo</h3>
          <p style={{ color: DS.textSec, fontSize: "13px", margin: 0 }}>Progetti in corso</p>
        </div>

        {inProgressProjects.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {inProgressProjects.map(proj => <ProjectCard key={proj.id} proj={proj} />)}
          </div>
        ) : (
          <div style={{ padding: "32px 20px", textAlign: "center", background: DS.card, border: `1px dashed ${DS.border}`, borderRadius: "12px", color: DS.textMut, fontSize: "13px" }}>
            Nessun progetto in corso
          </div>
        )}
      </div>
    </div>
  );
}
