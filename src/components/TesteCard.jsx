import { useState } from "react";
import Badge from "./ui/Badge.jsx";
import StatusDot from "./ui/StatusDot.jsx";
import { RES_STYLE, FUNC_STYLE } from "../styles/colors.js";

export default function TesteCard({ t, feeds, onEdit, onDel }) {
  const [open, setOpen] = useState(false);
  const rs = RES_STYLE[t.resultadoTipo] || RES_STYLE["Parcial"];

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e7e3", overflow: "hidden", transition: "box-shadow .15s", boxShadow: open ? "0 2px 12px rgba(0,0,0,0.05)" : "none" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: rs.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: rs.fg, flexShrink: 0 }}>
          {t.resultadoTipo === "Sucesso" ? "OK" : t.resultadoTipo === "Parcial" ? "~" : "X"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.teste}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 1 }}>{t.consultor} · {t.nicho} · {t.marketplace}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <StatusDot status={t.status} />
          <Badge label={t.resultadoTipo} bg={rs.bg} fg={rs.fg} />
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f0efea" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", padding: "12px 0", fontSize: 12 }}>
            <div><span style={{ color: "#aaa" }}>Problema:</span> <strong>{t.problema}</strong></div>
            <div><span style={{ color: "#aaa" }}>Categoria:</span> <strong>{t.categoriaSol}</strong></div>
            <div><span style={{ color: "#aaa" }}>Investimento:</span> <strong>{t.investimento}</strong></div>
            <div><span style={{ color: "#aaa" }}>Tempo:</span> <strong>{t.tempoDias} dias</strong></div>
            <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#aaa" }}>Resultado:</span> <strong>{t.resultado}</strong></div>
            <div><span style={{ color: "#aaa" }}>Data:</span> <strong>{t.data}</strong></div>
            <div><span style={{ color: "#aaa" }}>ID:</span> <strong>{t.id}</strong></div>
          </div>

          {feeds.length > 0 && (
            <div style={{ marginTop: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>
                Feedbacks de reuso ({feeds.length})
              </div>
              {feeds.map((f) => (
                <div key={f.id} style={{ fontSize: 12, padding: "4px 10px", background: "#f9f9f7", borderRadius: 6, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge label={f.funcionou} {...FUNC_STYLE[f.funcionou]} />
                  <strong>{f.consultor}</strong>: {f.resultado}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ height: 28, padding: "0 14px", borderRadius: 6, border: "1px solid #d8d7d2", background: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Editar</button>
            <button onClick={(e) => { e.stopPropagation(); onDel(); }} style={{ height: 28, padding: "0 14px", borderRadius: 6, border: "1px solid #f0c5c5", background: "#fff", fontSize: 12, cursor: "pointer", color: "#c33", fontWeight: 500 }}>Excluir</button>
          </div>
        </div>
      )}
    </div>
  );
}
