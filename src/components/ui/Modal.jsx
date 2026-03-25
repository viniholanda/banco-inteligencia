export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, width: "min(580px,92vw)", maxHeight: "86vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
      >
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a18", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1, padding: 4 }}>x</button>
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}
