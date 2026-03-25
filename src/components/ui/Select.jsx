export default function Select({ value, onChange, options, placeholder, style: s }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, color: "#2c2c2a", outline: "none", cursor: "pointer", appearance: "auto", ...s }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
