export default function FormGroup({ label, children, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b6a65", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}{required && <span style={{ color: "#d44" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
