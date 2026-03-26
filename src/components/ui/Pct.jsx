export default function Pct({ value, size = 42 }) {
  const v = Math.round(value);
  const color = v >= 70 ? "#16a050" : v >= 40 ? "#d49424" : "#e04848";
  const r = size / 2 - 3;
  const c = Math.PI * 2 * r;
  const off = c - (v / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eeeee8" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size < 36 ? 9 : 11, fontWeight: 700, color }}>
        {v}%
      </span>
    </div>
  );
}
