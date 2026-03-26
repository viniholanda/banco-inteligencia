import { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal.jsx";
import FormGroup from "./ui/FormGroup.jsx";
import Input from "./ui/Input.jsx";
import Select from "./ui/Select.jsx";
import { MARKETPLACES, FUNCIONOU_OPTS } from "../constants/index.js";
import { FUNC_STYLE } from "../styles/colors.js";

export default function FeedForm({ open, onClose, onSave, initial, nextId, tests }) {
  const [f, setF] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open) {
      setF(initial || {
        testeRef: "", consultor: "", marketplace: "Mercado Livre", nicho: "",
        funcionou: "Sim", resultado: "", adaptacao: "",
        data: new Date().toISOString().slice(0, 10),
        tempoDias: "",
      });
    }
  }, [open, initial]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const ok = f.testeRef && f.consultor && f.resultado;
  const sel = tests.find((t) => t.id === f.testeRef);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar " + initial.id : "Novo feedback (" + nextId + ")"}>
      <FormGroup label="Teste original" required>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, color: sel ? "#2c2c2a" : "#908f8a", width: "100%", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sel ? `${sel.id} — ${sel.consultor} — ${sel.teste.slice(0, 40)}` : "Selecione o teste..."}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginLeft: 8, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#908f8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 10, background: "#fff", border: "1px solid #d8d7d2", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: 320, overflowY: "auto" }}>
              {tests.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { up("testeRef", t.id); setDropdownOpen(false); }}
                  style={{ width: "100%", padding: "10px 14px", border: "none", borderBottom: "1px solid #f0efea", background: f.testeRef === t.id ? "#f0f7ff" : "#fff", cursor: "pointer", textAlign: "left", display: "block" }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", marginBottom: 3 }}>
                    {t.id} — {t.consultor} — {t.teste.slice(0, 50)}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b6a65", lineHeight: 1.5 }}>
                    <span style={{ color: "#908f8a" }}>Problema:</span> {t.problema} &nbsp;·&nbsp; <span style={{ color: "#908f8a" }}>Nicho:</span> {t.nicho}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b6a65", lineHeight: 1.5 }}>
                    <span style={{ color: "#908f8a" }}>Resultado:</span> {t.resultado}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </FormGroup>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <FormGroup label="Consultor" required>
          <Input value={f.consultor || ""} onChange={(e) => up("consultor", e.target.value)} placeholder="Quem aplicou" />
        </FormGroup>
        <FormGroup label="Marketplace">
          <Select value={f.marketplace || ""} onChange={(v) => up("marketplace", v)} options={MARKETPLACES} style={{ width: "100%" }} />
        </FormGroup>
        <FormGroup label="Nicho / Cliente">
          <Input value={f.nicho || ""} onChange={(e) => up("nicho", e.target.value)} placeholder="Nicho onde aplicou" />
        </FormGroup>
        <FormGroup label="Funcionou?">
          <div style={{ display: "flex", gap: 6 }}>
            {FUNCIONOU_OPTS.map((r) => {
              const s = FUNC_STYLE[r];
              return (
                <button key={r} onClick={() => up("funcionou", r)} style={{ flex: 1, height: 36, borderRadius: 8, border: f.funcionou === r ? `2px solid ${s.fg}` : "1px solid #d8d7d2", background: f.funcionou === r ? s.bg : "#fff", color: f.funcionou === r ? s.fg : "#888", fontSize: 13, fontWeight: f.funcionou === r ? 700 : 400, cursor: "pointer" }}>
                  {r}
                </button>
              );
            })}
          </div>
        </FormGroup>
        <div style={{ gridColumn: "1/-1" }}>
          <FormGroup label="Resultado" required>
            <Input value={f.resultado || ""} onChange={(e) => up("resultado", e.target.value)} placeholder="Ex: CTR +19%" />
          </FormGroup>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <FormGroup label="Adaptação feita">
            <Input value={f.adaptacao || ""} onChange={(e) => up("adaptacao", e.target.value)} placeholder="O que mudou?" />
          </FormGroup>
        </div>
        <FormGroup label="Data">
          <Input type="date" value={f.data || ""} onChange={(e) => up("data", e.target.value)} />
        </FormGroup>
        <FormGroup label="Tempo de teste (dias)">
          <Input type="number" value={f.tempoDias || ""} onChange={(e) => up("tempoDias", parseInt(e.target.value) || 0)} placeholder="Ex: 14" />
        </FormGroup>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
        <button disabled={!ok} onClick={() => onSave(f)} style={{ height: 38, padding: "0 24px", borderRadius: 8, border: "none", background: ok ? "#16a050" : "#ccc", color: "#fff", fontSize: 13, fontWeight: 600, cursor: ok ? "pointer" : "not-allowed" }}>Salvar</button>
      </div>
    </Modal>
  );
}
