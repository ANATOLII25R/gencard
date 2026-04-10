"use client";
import {
  Type, Square, Circle, Triangle, Minus, Image as ImageIcon,
  Undo2, Redo2, Download, Save, Trash2, Copy, ZoomIn, ZoomOut,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  ChevronUp, ChevronDown, Lock,
} from "lucide-react";
import type { Canvas as FabricCanvas, FabricObject } from "fabric";
import { useRef } from "react";

interface ToolbarProps {
  canvas: FabricCanvas | null;
  selectedObject: FabricObject | null;
  projectName: string;
  saving: boolean;
  onSave: () => void;
  onExport: (format: "png" | "pdf") => void;
  history: string[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
}

const ToolBtn = ({
  icon, title, onClick, active = false, danger = false,
}: {
  icon: React.ReactNode; title: string; onClick: () => void; active?: boolean; danger?: boolean;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: "34px", height: "34px", borderRadius: "8px",
      background: active ? "rgba(124,58,237,0.3)" : "transparent",
      border: active ? "1px solid var(--accent)" : "1px solid transparent",
      color: danger ? "#ef4444" : active ? "var(--accent-light)" : "var(--text-secondary)",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.15s",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
        (e.currentTarget as HTMLElement).style.color = danger ? "#f87171" : "var(--text-primary)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = danger ? "#ef4444" : "var(--text-secondary)";
      }
    }}
  >
    {icon}
  </button>
);

export default function Toolbar({
  canvas, selectedObject, projectName, saving, onSave, onExport,
  historyIndex, history, onUndo, onRedo,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addText = async () => {
    if (!canvas) return;
    const { IText } = await import("fabric");
    const text = new IText("Scrivi qui il testo", {
      left: canvas.width! / 2 - 100,
      top: canvas.height! / 2 - 20,
      fontSize: 36,
      fill: "#1a1a1a",
      fontFamily: "Inter, sans-serif",
      fontWeight: "bold",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRect = async () => {
    if (!canvas) return;
    const { Rect } = await import("fabric");
    const rect = new Rect({
      left: canvas.width! / 2 - 60,
      top: canvas.height! / 2 - 40,
      width: 120, height: 80,
      fill: "#7c3aed",
      rx: 8, ry: 8,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = async () => {
    if (!canvas) return;
    const { Circle } = await import("fabric");
    const circ = new Circle({
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 50,
      radius: 50, fill: "#2563eb",
    });
    canvas.add(circ);
    canvas.setActiveObject(circ);
    canvas.renderAll();
  };

  const addTriangle = async () => {
    if (!canvas) return;
    const { Triangle } = await import("fabric");
    const tri = new Triangle({
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 50,
      width: 100, height: 100,
      fill: "#059669",
    });
    canvas.add(tri);
    canvas.setActiveObject(tri);
    canvas.renderAll();
  };

  const addLine = async () => {
    if (!canvas) return;
    const { Line } = await import("fabric");
    const line = new Line([50, 0, 350, 0], {
      left: canvas.width! / 2 - 150,
      top: canvas.height! / 2,
      stroke: "#ffffff",
      strokeWidth: 3,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const { FabricImage } = await import("fabric");
      const imgEl = document.createElement("img");
      imgEl.src = ev.target?.result as string;
      imgEl.onload = () => {
        const img = new FabricImage(imgEl, {
          left: 50, top: 50,
          scaleX: Math.min(1, (canvas.width! * 0.5) / imgEl.width),
          scaleY: Math.min(1, (canvas.height! * 0.5) / imgEl.height),
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) { canvas.remove(obj); canvas.renderAll(); }
  };

  const duplicate = async () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    const clone = await obj.clone();
    clone.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.renderAll();
  };

  const bringForward = () => { if (canvas) { canvas.bringObjectForward(canvas.getActiveObject()!); canvas.renderAll(); } };
  const sendBackward = () => { if (canvas) { canvas.sendObjectBackwards(canvas.getActiveObject()!); canvas.renderAll(); } };

  const setTextAlign = (align: string) => {
    const obj = canvas?.getActiveObject() as { set?: (k: string, v: unknown) => void; type?: string } | undefined;
    if (obj?.type === "i-text" || obj?.type === "textbox") {
      obj.set?.("textAlign", align);
      canvas?.renderAll();
    }
  };

  const toggleBold = () => {
    const obj = canvas?.getActiveObject() as { get?: (k: string) => unknown; set?: (k: string, v: unknown) => void; type?: string } | undefined;
    if (obj?.type === "i-text" || obj?.type === "textbox") {
      const current = obj.get?.("fontWeight");
      obj.set?.("fontWeight", current === "bold" ? "normal" : "bold");
      canvas?.renderAll();
    }
  };

  const isText = selectedObject && (
    (selectedObject as { type?: string }).type === "i-text" ||
    (selectedObject as { type?: string }).type === "textbox"
  );

  return (
    <div style={{
      height: "52px",
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 12px", gap: "4px",
      overflow: "hidden",
    }}>
      {/* Project name */}
      <span style={{
        fontSize: "14px", fontWeight: 600, color: "var(--text-primary)",
        paddingRight: "12px", borderRight: "1px solid var(--border)", marginRight: "4px",
        maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {projectName}
      </span>

      {/* Undo / Redo */}
      <ToolBtn icon={<Undo2 size={16} />} title="Annulla (Ctrl+Z)" onClick={onUndo} active={false} />
      <ToolBtn icon={<Redo2 size={16} />} title="Ripristina (Ctrl+Y)" onClick={onRedo} active={false} />

      <div style={{ width: "1px", height: "28px", background: "var(--border)", margin: "0 4px" }} />

      {/* Add shapes */}
      <ToolBtn icon={<Type size={16} />} title="Aggiungi Testo" onClick={addText} />
      <ToolBtn icon={<Square size={16} />} title="Aggiungi Rettangolo" onClick={addRect} />
      <ToolBtn icon={<Circle size={16} />} title="Aggiungi Cerchio" onClick={addCircle} />
      <ToolBtn icon={<Triangle size={16} />} title="Aggiungi Triangolo" onClick={addTriangle} />
      <ToolBtn icon={<Minus size={16} />} title="Aggiungi Linea" onClick={addLine} />
      <ToolBtn
        icon={<ImageIcon size={16} />}
        title="Carica Immagine"
        onClick={() => fileInputRef.current?.click()}
      />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={addImage} style={{ display: "none" }} />

      <div style={{ width: "1px", height: "28px", background: "var(--border)", margin: "0 4px" }} />

      {/* Text tools — show only when text selected */}
      {isText && (
        <>
          <ToolBtn icon={<Bold size={15} />} title="Grassetto" onClick={toggleBold} />
          <ToolBtn icon={<Italic size={15} />} title="Corsivo" onClick={() => {}} />
          <ToolBtn icon={<Underline size={15} />} title="Sottolineato" onClick={() => {}} />
          <ToolBtn icon={<AlignLeft size={15} />} title="Allinea sinistra" onClick={() => setTextAlign("left")} />
          <ToolBtn icon={<AlignCenter size={15} />} title="Centra" onClick={() => setTextAlign("center")} />
          <ToolBtn icon={<AlignRight size={15} />} title="Allinea destra" onClick={() => setTextAlign("right")} />
          <div style={{ width: "1px", height: "28px", background: "var(--border)", margin: "0 4px" }} />
        </>
      )}

      {/* Object actions — show when something is selected */}
      {selectedObject && (
        <>
          <ToolBtn icon={<Copy size={15} />} title="Duplica" onClick={duplicate} />
          <ToolBtn icon={<ChevronUp size={15} />} title="Porta avanti" onClick={bringForward} />
          <ToolBtn icon={<ChevronDown size={15} />} title="Manda indietro" onClick={sendBackward} />
          <ToolBtn icon={<Trash2 size={15} />} title="Elimina" onClick={deleteSelected} danger />
          <div style={{ width: "1px", height: "28px", background: "var(--border)", margin: "0 4px" }} />
        </>
      )}

      {/* Zoom */}
      <ToolBtn icon={<ZoomIn size={15} />} title="Zoom +" onClick={() => {}} />
      <ToolBtn icon={<ZoomOut size={15} />} title="Zoom -" onClick={() => {}} />
      <ToolBtn icon={<Lock size={15} />} title="Blocca oggetto" onClick={() => {}} />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Save / Export */}
      <button onClick={onSave} disabled={saving} className="btn-secondary" style={{
        padding: "6px 14px", fontSize: "13px",
        opacity: saving ? 0.6 : 1,
      }}>
        <Save size={14} />
        {saving ? "Salvataggio..." : "Salva"}
      </button>

      <div style={{ position: "relative" }}>
        <button
          className="btn-primary"
          style={{ padding: "6px 14px", fontSize: "13px" }}
          onClick={() => onExport("png")}
        >
          <Download size={14} /> Esporta PNG
        </button>
      </div>
    </div>
  );
}
