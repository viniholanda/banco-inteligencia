import { useState, useEffect } from "react";
import Modal from "./ui/Modal.jsx";
import FormGroup from "./ui/FormGroup.jsx";
import Input from "./ui/Input.jsx";
import Select from "./ui/Select.jsx";
import Stars from "./ui/Stars.jsx";
import { PROBLEMAS, MARKETPLACES, CATEGORIAS_SOL, STATUS_LIST, INVESTIMENTOS } from "../constants/index.js";

export default function TesteForm({ open, onClose, onSave, initial, nextId }) {
  const [f, setF] = useState({});

  useEffect(() => {
    if (open) {
      setF(initial || {
        consultor: "", marketplace: "Mercado Livre", nicho: "", problema: "",
        teste: "", resultado: "", nota: 5,
        data: new Date().toISOString().slice(0, 10),
        status: "Ativo", categoriaSol: "Listing", investimento: "Baixo", tempoDias: "",
      });
    }
  }, [open, initial]);

  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.consultor && f.problema && f.teste;

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar teste " + initial.id : "Novo teste (" + nextId + ")"}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <FormGroup label="Consultor" required>
          <Input value={f.consultor || ""} onChange={(e) => up("consultor", e.target.value)} placeholder="Nome" />
        </FormGroup>
        <FormGroup label="Marketplace">
          <Select value={f.marketplace || ""} onChange={(v) => up("marketplace", v)} options={MARKETPLACES} style={{ width: "100%" }} />
        </FormGroup>
        <FormGroup label="Nicho / Cliente">
          <Input value={f.nicho || ""} onChange={(e) => up("nicho", e.target.value)} placeholder="Ex: Suplementos" />
        </FormGroup>
        <FormGroup label="Categoria do problema" required>
          <Select value={f.problema || ""} onChange={(v) => up("problema", v)} options={PROBLEMAS} placeholder="Selecione" style={{ width: "100%" }} />
        </FormGroup>
        <div style={{ gridColumn: "1/-1" }}>
          <FormGroup label="O que testou" required>
            <Input value={f.teste || ""} onChange={(e) => up("teste", e.target.value)} placeholder="Descreva o teste realizado" />
          </FormGroup>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <FormGroup label="O que aconteceu">
            <Input value={f.resultado || ""} onChange={(e) => up("resultado", e.target.value)} placeholder="Resultado observado" />
          </FormGroup>
        </div>
        <FormGroup label="Nota">
          <Stars n={f.nota || 5} size={22} interactive onChange={(v) => up("nota", v)} />
        </FormGroup>
        <FormGroup label="Data">
          <Input type="date" value={f.data || ""} onChange={(e) => up("data", e.target.value)} />
        </FormGroup>
        <FormGroup label="Status">
          <Select value={f.status || ""} onChange={(v) => up("status", v)} options={STATUS_LIST} style={{ width: "100%" }} />
        </FormGroup>
        <FormGroup label="Categoria da solução">
          <Select value={f.categoriaSol || ""} onChange={(v) => up("categoriaSol", v)} options={CATEGORIAS_SOL} style={{ width: "100%" }} />
        </FormGroup>
        <FormGroup label="Investimento">
          <Select value={f.investimento || ""} onChange={(v) => up("investimento", v)} options={INVESTIMENTOS} style={{ width: "100%" }} />
        </FormGroup>
        <FormGroup label="Tempo p/ resultado (dias)">
          <Input type="number" value={f.tempoDias || ""} onChange={(e) => up("tempoDias", parseInt(e.target.value) || 0)} placeholder="Ex: 7" />
        </FormGroup>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
        <button disabled={!valid} onClick={() => onSave(f)} style={{ height: 38, padding: "0 24px", borderRadius: 8, border: "none", background: valid ? "#3b82f6" : "#ccc", color: "#fff", fontSize: 13, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed" }}>Salvar</button>
      </div>
    </Modal>
  );
}
