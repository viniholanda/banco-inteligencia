import Stars from "./ui/Stars.jsx";
import Badge from "./ui/Badge.jsx";
import { FUNC_COLORS } from "../styles/colors.js";

export default function FeedCard({ f, orig, onEdit, onDelete }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e7e3", padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#908f8a", fontWeight: 600 }}>{f.id}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{f.consultor}</span>
            <Badge label={f.funcionou} {...FUNC_COLORS[f.funcionou]} />
            <Stars n={f.nota} size={12} />
          </div>
          {orig && (
            <div style={{ fontSize: 12, color: "#908f8a", marginBottom: 4 }}>
              Reuso de: <strong>{f.testeRef}</strong> — {orig.teste} ({orig.consultor})
            </div>
          )}
          <div style={{ fontSize: 13, color: "#2c2c2a" }}><strong>Resultado:</strong> {f.resultado}</div>
          {f.adaptacao && f.adaptacao !== "—" && (
            <div style={{ fontSize: 12, color: "#6b6a65", marginTop: 2 }}>Adaptacao: {f.adaptacao}</div>
          )}
          <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{f.marketplace} · {f.nicho} · {f.data} · {f.tempoDias} dias</div>
        </div>

        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button onClick={onEdit} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e8e7e3", background: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Editar">
            <svg width="14" height="14" fill="none" stroke="#888" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #f0c5c5", background: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Excluir">
            <svg width="14" height="14" fill="none" stroke="#c33" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
