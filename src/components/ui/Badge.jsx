export default function Badge({ label, bg, fg }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.2, color: fg, background: bg, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}
