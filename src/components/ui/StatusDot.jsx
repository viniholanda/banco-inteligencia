import Badge from "./Badge.jsx";
import { STATUS_COLORS } from "../../styles/colors.js";

export default function StatusDot({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Ativo"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      <Badge label={status} bg={c.bg} fg={c.fg} />
    </span>
  );
}
