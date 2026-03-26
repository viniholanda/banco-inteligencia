import Pct from "./Pct.jsx";

export default function KpiCard({ label, main, sub, color, ring }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #e8e7e3", display: "flex", alignItems: "center", gap: 14 }}>
      {ring !== undefined && <Pct value={ring} size={46} />}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
        <div style={{ fontSize: ring !== undefined ? 22 : 28, fontWeight: 700, color: color || "#1a1a18", lineHeight: 1.1, marginTop: 2 }}>{main}</div>
        {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}
