import Badge from "./Badge.jsx";
import { STATUS_STYLE } from "../../styles/colors.js";

export default function StatusDot({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["Ativo"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <Badge label={status} bg={s.bg} fg={s.fg} />
    </span>
  );
}
