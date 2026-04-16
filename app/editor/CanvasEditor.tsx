"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Canvas, FabricObject } from "fabric";

interface CanvasEditorProps {
  canvasData: string | null;
  width: number;
  height: number;
  onCanvasChange: (json: string, thumbnail: string) => void;
  onObjectSelected: (obj: FabricObject | null) => void;
  canvasRef: React.MutableRefObject<Canvas | null>;
}

export default function CanvasEditor({
  canvasData, width, height, onCanvasChange, onObjectSelected, canvasRef,
}: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  const handleChange = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const thumbnail = canvas.toDataURL({ format: "png", quality: 0.5, multiplier: 0.25 });
    onCanvasChange(json, thumbnail);
  }, [canvasRef, onCanvasChange]);

  useEffect(() => {
    if (!canvasEl.current) return;
    let fabricCanvas: Canvas;
    let destroyed = false;

    const init = async () => {
      const { Canvas, PencilBrush } = await import("fabric");

      // Dispose any previous instance (React StrictMode runs effects twice in dev)
      if (canvasRef.current) {
        try { canvasRef.current.dispose(); } catch {}
        canvasRef.current = null;
      }

      if (destroyed) return; // StrictMode cleanup already ran, abort

      fabricCanvas = new Canvas(canvasEl.current!, {
        width,
        height,
        backgroundColor: "#ffffff",
        selection: true,
        preserveObjectStacking: true,
      });
      void PencilBrush;
      canvasRef.current = fabricCanvas;

      // Load existing data
      if (canvasData) {
        try {
          const parsed = JSON.parse(canvasData);
          if (parsed.objects) {
            await fabricCanvas.loadFromJSON(parsed);
            fabricCanvas.renderAll();
          }
        } catch { /* ignore parse errors */ }
      }

      // Events
      fabricCanvas.on("object:modified", handleChange);
      fabricCanvas.on("object:added", handleChange);
      fabricCanvas.on("object:removed", handleChange);
      fabricCanvas.on("selection:created", (e) => onObjectSelected(e.selected?.[0] ?? null));
      fabricCanvas.on("selection:updated", (e) => onObjectSelected(e.selected?.[0] ?? null));
      fabricCanvas.on("selection:cleared", () => onObjectSelected(null));

      // Responsive scale
      const updateScale = () => {
        const container = containerRef.current;
        if (!container) return;
        const maxW = container.clientWidth - 40;
        const maxH = container.clientHeight - 40;
        const s = Math.min(maxW / width, maxH / height, 1);
        setScale(s);
      };
      updateScale();
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    };

    init();
    return () => {
      destroyed = true;
      if (fabricCanvas) {
        try { fabricCanvas.dispose(); } catch {}
      }
      canvasRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: "repeating-linear-gradient(45deg, #111118 0px, #111118 10px, #0d0d13 10px, #0d0d13 20px)",
      overflow: "hidden", position: "relative",
    }}>
      {/* Canvas wrapper with shadow */}
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        borderRadius: "4px",
      }}>
        <canvas ref={canvasEl} id="main-canvas" />
      </div>
    </div>
  );
}
