"use client";
import type { Canvas as FabricCanvas, FabricObject } from "fabric";

interface PropertiesPanelProps {
  selectedObject: FabricObject | null;
  canvas: FabricCanvas | null;
}

type AnyObj = Record<string, unknown> & {
  type?: string;
  set?: (k: string, v: unknown) => void;
  get?: (k: string) => unknown;
};

const GOOGLE_FONTS = [
  "Inter", "Roboto", "Playfair Display", "Oswald", "Montserrat",
  "Raleway", "Poppins", "Merriweather", "Source Sans Pro", "Lato",
  "Dancing Script", "Pacifico", "Fredoka One",
];

const COLOR_SWATCHES = [
  "#ffffff", "#000000", "#1a1a1a", "#f87171", "#fb923c", "#fbbf24",
  "#a3e635", "#34d399", "#38bdf8", "#818cf8", "#e879f9", "#f43f5e",
  "#7c3aed", "#2563eb", "#059669", "#d97706",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "11px", fontWeight: 700, color: "var(--text-muted)",
      textTransform: "uppercase", letterSpacing: "0.08em",
      marginBottom: "10px", marginTop: "4px",
    }}>
      {children}
    </div>
  );
}

function ColorPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {COLOR_SWATCHES.map((c) => (
          <button key={c} onClick={() => onChange(c)} style={{
            width: "22px", height: "22px", borderRadius: "6px",
            background: c, border: value === c ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer", flexShrink: 0,
            boxShadow: value === c ? "0 0 0 2px var(--accent)" : "none",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          border: "1px solid var(--border)", background: "none", cursor: "pointer",
          padding: "2px",
        }} />
        <input
          className="input-styled"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", padding: "6px 10px" }}
        />
      </div>
    </div>
  );
}

export default function PropertiesPanel({ selectedObject, canvas }: PropertiesPanelProps) {
  const obj = selectedObject as AnyObj | null;
  const type = obj?.type;

  const update = (key: string, value: unknown) => {
    if (!obj || !canvas) return;
    obj.set?.(key, value);
    canvas.renderAll();
  };

  const getVal = (key: string, fallback: unknown = "") =>
    obj?.get ? obj.get(key) ?? fallback : fallback;

  if (!obj) {
    // Background panel
    return (
      <div style={{ padding: "16px" }}>
        <SectionTitle>Sfondo Canvas</SectionTitle>
        <ColorPicker
          label="Colore sfondo"
          value={(canvas?.backgroundColor as string) || "#ffffff"}
          onChange={(c) => {
            if (!canvas) return;
            canvas.backgroundColor = c;
            canvas.renderAll();
          }}
        />
        <div style={{ marginTop: "16px" }}>
          <SectionTitle>Sfondi Gradiente</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "Tramonto", colors: ["#667eea", "#764ba2"] },
              { label: "Aurora", colors: ["#f093fb", "#f5576c"] },
              { label: "Oceano", colors: ["#4facfe", "#00f2fe"] },
              { label: "Foresta", colors: ["#43e97b", "#38f9d7"] },
              { label: "Fuoco", colors: ["#fa709a", "#fee140"] },
              { label: "Notte", colors: ["#0f0c29", "#302b63"] },
            ].map((g, i) => (
              <button key={i} onClick={async () => {
                if (!canvas) return;
                const { Gradient } = await import("fabric");
                const grad = new Gradient({
                  type: "linear",
                  gradientUnits: "pixels",
                  coords: { x1: 0, y1: 0, x2: canvas.width!, y2: canvas.height! },
                  colorStops: [
                    { offset: 0, color: g.colors[0] },
                    { offset: 1, color: g.colors[1] },
                  ],
                });
                canvas.set("backgroundColor", grad as unknown as string);
                canvas.renderAll();
              }} style={{
                borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)",
                background: "none", cursor: "pointer", padding: 0,
              }}>
                <div style={{
                  height: "32px",
                  background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                }} />
                <div style={{ fontSize: "11px", color: "var(--text-muted)", padding: "4px", background: "var(--bg-card)" }}>
                  {g.label}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "20px", padding: "12px", background: "var(--bg-card)", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>
            💡 Seleziona un elemento sul canvas per modificarne le proprietà
          </div>
        </div>
      </div>
    );
  }

  const isText = type === "i-text" || type === "textbox";
  const isShape = type === "rect" || type === "circle" || type === "triangle" || type === "ellipse";
  const isSVG = type === "path";

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "2px" }}>
      {/* Position & Size */}
      <SectionTitle>Posizione e Dimensioni</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
        {[
          { label: "X", key: "left" },
          { label: "Y", key: "top" },
          { label: "Larghezza", key: "width" },
          { label: "Altezza", key: "height" },
        ].map(({ label, key }) => (
          <div key={key}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
            <input
              type="number"
              className="input-styled"
              value={Math.round(Number(getVal(key, 0)))}
              onChange={(e) => update(key, Number(e.target.value))}
              style={{ padding: "6px 10px", fontSize: "13px" }}
            />
          </div>
        ))}
      </div>

      {/* Rotation */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
          Rotazione: {Math.round(Number(getVal("angle", 0)))}°
        </div>
        <input
          type="range" min={0} max={360}
          value={Number(getVal("angle", 0))}
          onChange={(e) => update("angle", Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
      </div>

      {/* Opacity */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
          Opacità: {Math.round(Number(getVal("opacity", 1)) * 100)}%
        </div>
        <input
          type="range" min={0} max={1} step={0.01}
          value={Number(getVal("opacity", 1))}
          onChange={(e) => update("opacity", Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
      </div>

      {/* Color */}
      {(isShape || isSVG) && (
        <>
          <SectionTitle>Colore</SectionTitle>
          <ColorPicker
            label="Riempimento"
            value={String(getVal("fill", "#7c3aed"))}
            onChange={(c) => update("fill", c)}
          />
          <ColorPicker
            label="Bordo"
            value={String(getVal("stroke", "transparent"))}
            onChange={(c) => update("stroke", c)}
          />
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Spessore bordo: {Number(getVal("strokeWidth", 0))}px
            </div>
            <input
              type="range" min={0} max={20}
              value={Number(getVal("strokeWidth", 0))}
              onChange={(e) => update("strokeWidth", Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>
        </>
      )}

      {/* Text properties */}
      {isText && (
        <>
          <SectionTitle>Testo</SectionTitle>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Font</div>
            <select
              className="input-styled"
              value={String(getVal("fontFamily", "Inter"))}
              onChange={(e) => update("fontFamily", e.target.value)}
              style={{ padding: "6px 10px", fontSize: "13px" }}
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Dimensione: {Number(getVal("fontSize", 24))}px
            </div>
            <input
              type="range" min={8} max={200}
              value={Number(getVal("fontSize", 24))}
              onChange={(e) => update("fontSize", Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>
          <ColorPicker
            label="Colore testo"
            value={String(getVal("fill", "#000000"))}
            onChange={(c) => update("fill", c)}
          />
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Interlinea</div>
            <input
              type="range" min={0.5} max={3} step={0.1}
              value={Number(getVal("lineHeight", 1.3))}
              onChange={(e) => update("lineHeight", Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>
        </>
      )}

      {/* Delete */}
      <div style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => { if (!canvas) return; canvas.remove(selectedObject!); canvas.renderAll(); }}
          style={{
            width: "100%", padding: "8px", borderRadius: "8px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
        >
          🗑️ Elimina Elemento
        </button>
      </div>
    </div>
  );
}
