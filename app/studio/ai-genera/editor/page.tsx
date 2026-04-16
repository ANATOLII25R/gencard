"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Canvas, FabricObject } from "fabric";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Sliders, CheckCircle2, Clock } from "lucide-react";

const CanvasEditor = dynamic(() => import("../../../editor/CanvasEditor"), { ssr: false });
const Toolbar = dynamic(() => import("../../../editor/Toolbar"), { ssr: false });
const PropertiesPanel = dynamic(() => import("../../../editor/PropertiesPanel"), { ssr: false });

const AUTOSAVE_DELAY = 3000;

export default function AIEditorPage() {
  const router = useRouter();
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"properties" | "layers">("properties");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [projectName, setProjectName] = useState("Nuovo Design");
  const [editingName, setEditingName] = useState(false);
  const [completing, setCompleting] = useState(false);

  const canvasRef = useRef<Canvas | null>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveProject = useCallback(async () => {
    setSaving(true);
    try {
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }, []);

  const handleCanvasChange = useCallback((json: string, thumbnail: string) => {
    const newHistory = history.current.slice(0, historyIndex.current + 1);
    newHistory.push(json);
    if (newHistory.length > 50) newHistory.shift();
    history.current = newHistory;
    historyIndex.current = newHistory.length - 1;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => saveProject(), AUTOSAVE_DELAY);
  }, [saveProject]);

  const undo = useCallback(async () => {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    const json = history.current[historyIndex.current];
    if (canvasRef.current && json) {
      await canvasRef.current.loadFromJSON(JSON.parse(json));
      canvasRef.current.renderAll();
    }
  }, []);

  const redo = useCallback(async () => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    const json = history.current[historyIndex.current];
    if (canvasRef.current && json) {
      await canvasRef.current.loadFromJSON(JSON.parse(json));
      canvasRef.current.renderAll();
    }
  }, []);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${projectName}.png`;
    a.click();
  }, [projectName]);

  const handleExport = (format: "png" | "pdf") => {
    if (format === "png") exportPNG();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveProject(); }
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = canvasRef.current?.getActiveObject();
        if (active && !["i-text", "textbox"].includes((active as {type?: string}).type ?? "")) {
          canvasRef.current?.remove(active);
          canvasRef.current?.renderAll();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, saveProject]);

  const completeProject = () => {
    router.push("/studio");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", background: "var(--bg-primary)", overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{
        height: "52px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/studio")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 10px", borderRadius: "8px",
            background: "transparent", border: "none",
            color: "var(--text-secondary)", cursor: "pointer",
            fontSize: "13px", transition: "all 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          <ArrowLeft size={16} /> Studio
        </button>

        <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />

        <span
          onClick={() => setEditingName(true)}
          title="Clicca per rinominare"
          style={{
            fontSize: "14px", fontWeight: 600, cursor: "pointer",
            padding: "4px 8px", borderRadius: "6px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          {projectName}
        </span>

        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {saving ? "⟳ Salvataggio..." : savedAt ? `✓ Salvato ${savedAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}` : ""}
        </span>

        <span style={{
          marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)",
          padding: "4px 10px", background: "var(--bg-card)", borderRadius: "6px", border: "1px solid var(--border)",
        }}>
          800 × 600 px
        </span>
      </div>

      {/* Main toolbar */}
      <Toolbar
        canvas={canvasRef.current}
        selectedObject={selectedObject}
        projectName={projectName}
        saving={saving}
        onSave={() => saveProject()}
        onExport={handleExport}
        history={history.current}
        historyIndex={historyIndex.current}
        onUndo={undo}
        onRedo={redo}
      />

      {/* Editor body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <CanvasEditor
          canvasData={null}
          width={800}
          height={600}
          onCanvasChange={handleCanvasChange}
          onObjectSelected={setSelectedObject}
          canvasRef={canvasRef}
        />

        <aside style={{
          width: rightPanelOpen ? "260px" : "0px",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden", flexShrink: 0,
          position: "relative",
        }}>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            style={{
              position: "absolute", left: "-14px", top: "50%",
              transform: "translateY(-50%)",
              width: "24px", height: "44px", borderRadius: "6px 0 0 6px",
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRight: "none", color: "var(--text-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 10,
            }}
          >
            {rightPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {rightPanelOpen && (
            <>
              <div style={{
                display: "flex", borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}>
                {([
                  { id: "properties", icon: <Sliders size={14} />, label: "Proprietà" },
                  { id: "layers", icon: <Layers size={14} />, label: "Livelli" },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRightPanelTab(tab.id)}
                    style={{
                      flex: 1, padding: "10px 8px",
                      background: rightPanelTab === tab.id ? "var(--bg-card)" : "transparent",
                      border: "none", borderBottom: rightPanelTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
                      color: rightPanelTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      fontSize: "12px", fontWeight: 600, transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {rightPanelTab === "properties" && (
                  <PropertiesPanel
                    selectedObject={selectedObject}
                    canvas={canvasRef.current}
                  />
                )}
                {rightPanelTab === "layers" && (
                  <LayersPanel canvas={canvasRef.current} selectedObject={selectedObject} />
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Bottom action bar */}
      <div style={{
        height: "56px",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 16px",
        gap: "10px",
        flexShrink: 0,
      }}>
        <button
          onClick={() => completeProject()}
          disabled={completing}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "10px",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            cursor: completing ? "not-allowed" : "pointer",
            fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
            opacity: completing ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (!completing) (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <Clock size={16} /> Continua dopo
        </button>
        <button
          onClick={() => completeProject()}
          disabled={completing}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 24px", borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            border: "none",
            color: "#fff",
            cursor: completing ? "not-allowed" : "pointer",
            fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
            opacity: completing ? 0.5 : 1,
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (!completing) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <CheckCircle2 size={16} /> Termina progetto
        </button>
      </div>
    </div>
  );
}

function LayersPanel({ canvas, selectedObject }: { canvas: Canvas | null; selectedObject: FabricObject | null }) {
  const objects = canvas?.getObjects() ?? [];
  const reversed = [...objects].reverse();

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
        Livelli ({objects.length})
      </div>
      {reversed.length === 0 && (
        <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>
          Nessun elemento sul canvas
        </div>
      )}
      {reversed.map((obj, i) => {
        const isSelected = obj === selectedObject;
        const type = (obj as { type?: string }).type ?? "oggetto";
        const typeLabel: Record<string, string> = {
          "i-text": "Testo", textbox: "Testo", rect: "Rettangolo",
          circle: "Cerchio", triangle: "Triangolo", image: "Immagine",
          line: "Linea", path: "Forma",
        };
        return (
          <div
            key={i}
            onClick={() => { canvas?.setActiveObject(obj); canvas?.renderAll(); }}
            style={{
              padding: "8px 10px", borderRadius: "8px", marginBottom: "4px",
              background: isSelected ? "rgba(124,58,237,0.15)" : "var(--bg-card)",
              border: isSelected ? "1px solid rgba(124,58,237,0.4)" : "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "16px" }}>
              {type === "i-text" || type === "textbox" ? "T" :
               type === "rect" ? "⬜" : type === "circle" ? "⭕" :
               type === "triangle" ? "🔺" : type === "image" ? "🖼️" : "◆"}
            </span>
            <span style={{ fontSize: "13px", color: isSelected ? "var(--accent-light)" : "var(--text-secondary)", fontWeight: isSelected ? 600 : 400 }}>
              {typeLabel[type] ?? type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
