export default function BarPct({ value, color = "#16a050", height = 6 }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div style={{ height, background: "#eeeee8", borderRadius: height / 2, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: v + "%", background: color, borderRadius: height / 2, transition: "width .4s" }} />
    </div>
  );
}
