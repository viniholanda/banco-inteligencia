export default function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, color: "#2c2c2a", outline: "none", width: "100%", ...(style || {}) }}
    />
  );
}
