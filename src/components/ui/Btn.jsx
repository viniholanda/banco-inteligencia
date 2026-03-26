export default function Btn({ onClick, bg, label }) {
  return (
    <button onClick={onClick} style={{ height: 32, padding: "0 16px", borderRadius: 7, border: "none", background: bg, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      {label}
    </button>
  );
}
