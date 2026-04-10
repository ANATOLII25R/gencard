const DS = { card: "#111827", border: "#1E293B", textMut: "#475569" };

function Skeleton({ w = "100%", h = "20px", radius = "8px" }: { w?: string; h?: string; radius?: string }) {
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: `linear-gradient(90deg, ${DS.card} 25%, rgba(255,255,255,0.04) 50%, ${DS.card} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
  );
}

export default function DashboardLoading() {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton w="200px" h="28px" radius="6px" />
          <Skeleton w="300px" h="14px" radius="4px" />
        </div>
        {/* Cards skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <Skeleton w="120px" h="14px" />
              <Skeleton w="80px" h="32px" />
            </div>
          ))}
        </div>
        {/* Content skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Skeleton w="140px" h="14px" />
            <Skeleton w="160px" h="40px" />
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((_, i) => (
                <Skeleton key={i} w="100%" h="60%" radius="4px 4px 0 0" />
              ))}
            </div>
          </div>
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <Skeleton w="120px" h="16px" />
            {[1, 2, 3, 4].map(i => <Skeleton key={i} w="100%" h="36px" radius="6px" />)}
          </div>
        </div>
      </div>
    </>
  );
}
