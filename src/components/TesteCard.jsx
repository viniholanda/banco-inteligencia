import { useState } from "react";
import Stars from "./ui/Stars.jsx";
import Badge from "./ui/Badge.jsx";
import StatusDot from "./ui/StatusDot.jsx";
import { FUNC_COLORS } from "../styles/colors.js";

export default function TesteCard({ t, feeds, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e7e3", overflow: "hidden", transition: "box-shadow .15s", boxShadow: open ? "0 2px 12px rgba(0,0,0,0.06)" : "none" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0efea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6b6a65", flexShrink: 0 }}>
          {t.id.replace("T-", "")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{t.teste}</span>
          </div>
          <div style={{ fontSize: 12, color: "#908f8a", marginTop: 2 }}>{t.consultor} · {t.nicho} · {t.marketplace}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <StatusDot status={t.status} />
          <Stars n={t.nota} size={12} />
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f0efea" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", padding: "12px 0", fontSize: 12 }}>
            <div><span style={{ color: "#908f8a" }}>Problema:</span> <strong>{t.problema}</strong></div>
            <div><span style={{ color: "#908f8a" }}>Categoria:</span> <strong>{t.categoriaSol}</strong></div>
            <div><span style={{ color: "#908f8a" }}>Investimento:</span> <strong>{t.investimento}</strong></div>
            <div><span style={{ color: "#908f8a" }}>Tempo:</span> <strong>{t.tempoDias} dias</strong></div>
            <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#908f8a" }}>Resultado:</span> <strong>{t.resultado}</strong></div>
            <div><span style={{ color: "#908f8a" }}>Data:</span> <strong>{t.data}</strong></div>
          </div>

          {feeds.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#908f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                Feedbacks de reuso ({feeds.length})
              </div>
              {feeds.map((f) => (
                <div key={f.id} style={{ fontSize: 12, padding: "5px 10px", background: "#f9f9f7", borderRadius: 6, marginBottom: 3 }}>
                  <strong>{f.consultor}</strong>: {f.resultado} <Badge label={f.funcionou} {...FUNC_COLORS[f.funcionou]} />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ height: 30, padding: "0 14px", borderRadius: 6, border: "1px solid #d8d7d2", background: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Editar</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ height: 30, padding: "0 14px", borderRadius: 6, border: "1px solid #f0c5c5", background: "#fff", fontSize: 12, cursor: "pointer", color: "#c33", fontWeight: 500 }}>Excluir</button>
          </div>
        </div>
      )}
    </div>
  );
}
