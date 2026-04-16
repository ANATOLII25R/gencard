"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Canvas, FabricObject } from "fabric";
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Sliders, CheckCircle2, Clock, LayoutTemplate, Shapes, Type, Palette, Upload, Wrench, Folder, Grid3X3, Sparkles } from "lucide-react";
import type { Project } from "@/types";

const CanvasEditor = dynamic(() => import("../CanvasEditor"), { ssr: false });
const Toolbar = dynamic(() => import("../Toolbar"), { ssr: false });
const PropertiesPanel = dynamic(() => import("../PropertiesPanel"), { ssr: false });

interface EditorClientProps {
  project: Project | null;
  userId: string;
}

const AUTOSAVE_DELAY = 3000;

export default function EditorClient({ project: initialProject }: EditorClientProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(initialProject);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<"properties" | "layers">("properties");
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);

  const canvasRef = useRef<Canvas | null>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!project) {
      setProject({
        id: "temp",
        name: "Nuovo Design",
        description: null,
        thumbnail: null,
        canvasData: JSON.stringify({ version: "6.0.0", objects: [] }),
        width: 800,
        height: 600,
        status: "IN_PROGRESS",
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    }
  }, [project]);

  if (!project) return null;

  const saveProject = useCallback(async (status?: "IN_PROGRESS" | "COMPLETED") => {
    if (!project || !canvasRef.current) return;

    setSaving(true);
    try {
      const canvasJson = canvasRef.current.toJSON();
      const payload: Record<string, any> = {
        canvasData: JSON.stringify(canvasJson),
      };

      if (currentThumbnail) {
        payload.thumbnail = currentThumbnail;
      }

      if (status) {
        payload.status = status;
      }

      const response = await fetch(`/api/progetti/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setSavedAt(new Date());
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  }, [project, currentThumbnail]);

  const handleCanvasChange = useCallback((json: string, thumbnail?: string) => {
    const newHistory = history.current.slice(0, historyIndex.current + 1);
    newHistory.push(json);
    if (newHistory.length > 50) newHistory.shift();
    history.current = newHistory;
    historyIndex.current = newHistory.length - 1;

    if (thumbnail) {
      setCurrentThumbnail(thumbnail);
    }

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => saveProject(), AUTOSAVE_DELAY);
  }, [saveProject]);

  const undo = useCallback(() => {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    const json = history.current[historyIndex.current];
    if (canvasRef.current && json) {
      canvasRef.current.loadFromJSON(JSON.parse(json)).then(() => {
        canvasRef.current?.renderAll();
      });
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    const json = history.current[historyIndex.current];
    if (canvasRef.current && json) {
      canvasRef.current.loadFromJSON(JSON.parse(json)).then(() => {
        canvasRef.current?.renderAll();
      });
    }
  }, []);

  const exportPNG = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL({ format: "png", quality: 1, multiplier: 1 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${project.name}.png`;
    a.click();
  }, [project.name]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveProject(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, saveProject]);

  const SIDEBAR_ITEMS = [
    { id: "templates", Icon: LayoutTemplate, label: "Modelli" },
    { id: "elements", Icon: Shapes, label: "Elementi" },
    { id: "text", Icon: Type, label: "Testo" },
    { id: "brand", Icon: Palette, label: "Brand" },
    { id: "uploads", Icon: Upload, label: "Caricamenti" },
    { id: "tools", Icon: Wrench, label: "Strumenti" },
    { id: "projects", Icon: Folder, label: "Progetti" },
    { id: "apps", Icon: Grid3X3, label: "Applicazioni" },
    { id: "magic", Icon: Sparkles, label: "Magia" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>

      {/* TOP BAR */}
      <div style={{ height: "52px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", flexShrink: 0 }}>
        <button onClick={() => router.push("/studio/design")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "8px", background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
          <ArrowLeft size={16} /> I Miei Design
        </button>
        <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{project.name}</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{saving ? "⟳ Salvataggio..." : savedAt ? "✓ Salvato" : ""}</span>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", padding: "4px 10px", background: "var(--bg-card)", borderRadius: "6px", border: "1px solid var(--border)" }}>{project.width} × {project.height} px</span>
      </div>

      {/* TOOLBAR */}
      <Toolbar canvas={canvasRef.current} selectedObject={selectedObject} projectName={project.name} saving={saving} onSave={saveProject} onExport={(fmt) => fmt === "png" && exportPNG()} history={history.current} historyIndex={historyIndex.current} onUndo={undo} onRedo={redo} />

      {/* EDITOR LAYOUT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width: "72px", background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "8px", gap: "4px", alignItems: "center", overflow: "auto" }}>
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.id} title={item.label} style={{ width: "56px", height: "56px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "9px", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>
              <item.Icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* CANVAS */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <CanvasEditor canvasData={project.canvasData ?? null} width={project.width} height={project.height} onCanvasChange={handleCanvasChange} onObjectSelected={setSelectedObject} canvasRef={canvasRef} />
        </div>

        {/* RIGHT PANEL */}
        <aside style={{ width: rightPanelOpen ? "260px" : "0px", background: "var(--bg-secondary)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", transition: "width 0.25s", overflow: "hidden", flexShrink: 0, position: "relative" }}>
          <button onClick={() => setRightPanelOpen(!rightPanelOpen)} style={{ position: "absolute", left: "-14px", top: "50%", transform: "translateY(-50%)", width: "24px", height: "44px", borderRadius: "6px 0 0 6px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRight: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            {rightPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {rightPanelOpen && (
            <>
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                {[{ id: "properties", icon: <Sliders size={14} />, label: "Proprietà" }, { id: "layers", icon: <Layers size={14} />, label: "Livelli" }].map((tab: any) => (
                  <button key={tab.id} onClick={() => setRightPanelTab(tab.id)} style={{ flex: 1, padding: "10px 8px", background: rightPanelTab === tab.id ? "var(--bg-card)" : "transparent", border: "none", borderBottom: rightPanelTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent", color: rightPanelTab === tab.id ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", fontWeight: 600, fontFamily: "inherit" }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {rightPanelTab === "properties" && <PropertiesPanel selectedObject={selectedObject} canvas={canvasRef.current} />}
                {rightPanelTab === "layers" && <LayersPanel canvas={canvasRef.current} selectedObject={selectedObject} />}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ height: "56px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", gap: "10px", flexShrink: 0 }}>
        <button onClick={async () => { await saveProject("IN_PROGRESS"); router.push("/studio/design"); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
          <Clock size={16} /> Continua dopo
        </button>
        <button onClick={async () => { await saveProject("COMPLETED"); router.push("/studio/design"); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit", boxShadow: "0 4px 12px rgba(16,185,129,0.3)", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}>
          <CheckCircle2 size={16} /> Termina progetto
        </button>
      </div>
    </div>
  );
}

function LayersPanel({ canvas, selectedObject }: { canvas: Canvas | null; selectedObject: FabricObject | null }) {
  const objects = canvas?.getObjects() ?? [];
  return (
    <div style={{ padding: "12px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Livelli ({objects.length})</div>
      {objects.length === 0 && <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>Nessun elemento</div>}
      {[...objects].reverse().map((obj, i) => {
        const isSelected = obj === selectedObject;
        const type = (obj as any).type ?? "oggetto";
        const typeLabel: Record<string, string> = { "i-text": "Testo", "textbox": "Testo", "rect": "Rettangolo", "circle": "Cerchio", "image": "Immagine" };
        return (
          <div key={i} onClick={() => { canvas?.setActiveObject(obj); canvas?.renderAll(); }} style={{ padding: "8px 10px", borderRadius: "8px", marginBottom: "4px", background: isSelected ? "rgba(124,58,237,0.15)" : "var(--bg-card)", border: isSelected ? "1px solid rgba(124,58,237,0.4)" : "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: isSelected ? "var(--accent)" : "var(--text-secondary)" }}>{typeLabel[type] ?? type}</span>
          </div>
        );
      })}
    </div>
  );
}
