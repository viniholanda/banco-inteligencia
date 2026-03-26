export default function IconBtn({ onClick, stroke, path, border }) {
  return (
    <button onClick={onClick} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${border || "#e8e7e3"}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
      <svg width="14" height="14" fill="none" stroke={stroke} strokeWidth="1.5" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </button>
  );
}
