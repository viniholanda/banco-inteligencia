import { useState, useEffect, useMemo, useCallback } from "react";

import { PROBLEMAS, MARKETPLACES, STATUS_LIST } from "./constants/index.js";
import { INITIAL_TESTS, INITIAL_FEEDS } from "./data/initial.js";
import { FUNC_STYLE, RES_STYLE } from "./styles/colors.js";
import { loadData, saveData } from "./utils/storage.js";
import { calcSuccessRate, calcFeedbackSuccess } from "./utils/stats.js";

import DashView from "./components/DashView.jsx";
import TesteCard from "./components/TesteCard.jsx";
import FeedCard from "./components/FeedCard.jsx";
import TesteForm from "./components/TesteForm.jsx";
import FeedForm from "./components/FeedForm.jsx";
import Modal from "./components/ui/Modal.jsx";
import Input from "./components/ui/Input.jsx";
import Select from "./components/ui/Select.jsx";
import Badge from "./components/ui/Badge.jsx";
import Pct from "./components/ui/Pct.jsx";
import Btn from "./components/ui/Btn.jsx";
import Empty from "./components/ui/Empty.jsx";

const TABS = [
  { key: "dash",     label: "Dashboard" },
  { key: "testes",   label: "Testes" },
  { key: "feeds",    label: "Feedbacks" },
  { key: "playbook", label: "Playbook" },
];

export default function App() {
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [feeds, setFeeds] = useState(INITIAL_FEEDS);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dash");
  const [showFormT, setShowFormT] = useState(false);
  const [showFormF, setShowFormF] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [fProb, setFProb] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fMkt, setFMkt] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => {
    loadData().then((d) => {
      if (d) { setTests(d.tests); setFeeds(d.feeds); }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveData(tests, feeds);
  }, [tests, feeds, loaded]);

  const notify = useCallback((m) => { setToast(m); setTimeout(() => setToast(""), 2200); }, []);

  const nextTId = useMemo(() => `T-${String(Math.max(0, ...tests.map((t) => parseInt(t.id.replace("T-", "")) || 0)) + 1).padStart(3, "0")}`, [tests]);
  const nextFId = useMemo(() => `F-${String(Math.max(0, ...feeds.map((f) => parseInt(f.id.replace("F-", "")) || 0)) + 1).padStart(3, "0")}`, [feeds]);

  const filtered = useMemo(() => tests.filter((t) => {
    if (fProb && t.problema !== fProb) return false;
    if (fStatus && t.status !== fStatus) return false;
    if (fMkt && t.marketplace !== fMkt) return false;
    if (search && !JSON.stringify(t).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tests, fProb, fStatus, fMkt, search]);

  const globalSuccess = useMemo(() => calcSuccessRate(tests), [tests]);
  const feedSuccess   = useMemo(() => calcFeedbackSuccess(feeds), [feeds]);

  const byProblema = useMemo(() => {
    const m = {};
    tests.forEach((t) => { if (!m[t.problema]) m[t.problema] = []; m[t.problema].push(t); });
    return Object.entries(m).map(([name, arr]) => {
      const s = calcSuccessRate(arr);
      const fb = feeds.filter((f) => arr.some((t) => t.id === f.testeRef));
      const fbS = calcFeedbackSuccess(fb);
      return { name, total: arr.length, rate: s.rate, sucesso: s.sucesso, feedRate: fbS.rate, feedTotal: fbS.total };
    }).sort((a, b) => b.total - a.total);
  }, [tests, feeds]);

  const byConsultor = useMemo(() => {
    const m = {};
    tests.forEach((t) => { if (!m[t.consultor]) m[t.consultor] = []; m[t.consultor].push(t); });
    return Object.entries(m).map(([name, arr]) => {
      const s = calcSuccessRate(arr);
      return { name, total: arr.length, rate: s.rate, sucesso: s.sucesso };
    }).sort((a, b) => b.rate - a.rate || b.total - a.total);
  }, [tests]);

  const byMkt = useMemo(() => {
    const m = {};
    tests.forEach((t) => { if (!m[t.marketplace]) m[t.marketplace] = []; m[t.marketplace].push(t); });
    return Object.entries(m).map(([name, arr]) => ({ name, total: arr.length, rate: calcSuccessRate(arr).rate })).sort((a, b) => b.total - a.total);
  }, [tests]);

  const playbook = useMemo(() => {
    return tests
      .filter((t) => t.status === "Prática padrão" && t.resultadoTipo === "Sucesso")
      .map((t) => {
        const fb = feeds.filter((f) => f.testeRef === t.id);
        const ok = fb.filter((f) => f.funcionou === "Sim").length;
        return { ...t, feedbacks: fb, totalReuso: fb.length, taxaSuc: fb.length ? Math.round(ok / fb.length * 100) : null };
      })
      .sort((a, b) => (b.taxaSuc || 0) - (a.taxaSuc || 0) || b.totalReuso - a.totalReuso);
  }, [tests, feeds]);

  function saveT(data) {
    if (editItem) { setTests((p) => p.map((t) => t.id === editItem.id ? { ...t, ...data } : t)); notify("Teste atualizado"); }
    else { setTests((p) => [...p, { ...data, id: nextTId }]); notify("Teste registrado"); }
    setShowFormT(false); setEditItem(null);
  }
  function saveF(data) {
    if (editItem) { setFeeds((p) => p.map((f) => f.id === editItem.id ? { ...f, ...data } : f)); notify("Feedback atualizado"); }
    else { setFeeds((p) => [...p, { ...data, id: nextFId }]); notify("Feedback registrado"); }
    setShowFormF(false); setEditItem(null);
  }
  function deleteT(id) { setTests((p) => p.filter((t) => t.id !== id)); setConfirmDel(null); notify("Teste removido"); }
  function deleteF(id) { setFeeds((p) => p.filter((f) => f.id !== id)); setConfirmDel(null); notify("Feedback removido"); }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f4f3ef", minHeight: "100vh" }}>

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#1a1a18", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", animation: "fadeIn .2s" }}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "#1a1a18", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.3 }}>Banco de Inteligencia</h1>
          <p style={{ fontSize: 11, color: "#78776f", margin: "2px 0 0" }}>Grupo Escalada Ecom · Gestão de testes e soluções</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tab === "testes"   && <Btn onClick={() => { setEditItem(null); setShowFormT(true); }} bg="#2563eb" label="+ Novo teste" />}
          {tab === "feeds"    && <Btn onClick={() => { setEditItem(null); setShowFormF(true); }} bg="#16a050" label="+ Novo feedback" />}
          <button onClick={() => { setTests(INITIAL_TESTS); setFeeds(INITIAL_FEEDS); notify("Dados restaurados"); }} style={{ height: 32, padding: "0 12px", borderRadius: 7, border: "1px solid #3a3a38", background: "transparent", color: "#78776f", fontSize: 11, cursor: "pointer" }}>
            Resetar
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e8e7e3", padding: "0 24px", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "11px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 400, color: tab === t.key ? "#1a1a18" : "#999", borderBottom: tab === t.key ? "2.5px solid #1a1a18" : "2.5px solid transparent", transition: "all .12s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 940, margin: "0 auto" }}>

        {tab === "dash" && (
          <DashView
            globalSuccess={globalSuccess}
            feedSuccess={feedSuccess}
            tests={tests}
            feeds={feeds}
            byProblema={byProblema}
            byConsultor={byConsultor}
            byMkt={byMkt}
          />
        )}

        {tab === "testes" && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
              <Select value={fProb} onChange={setFProb} options={PROBLEMAS} placeholder="Problema" />
              <Select value={fStatus} onChange={setFStatus} options={STATUS_LIST} placeholder="Status" />
              <Select value={fMkt} onChange={setFMkt} options={MARKETPLACES} placeholder="Marketplace" />
              {(fProb || fStatus || fMkt || search) && (
                <button onClick={() => { setFProb(""); setFStatus(""); setFMkt(""); setSearch(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 12, cursor: "pointer", color: "#888" }}>Limpar</button>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 8px" }}>{filtered.length} de {tests.length} testes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filtered.map((t) => (
                <TesteCard key={t.id} t={t} feeds={feeds.filter((f) => f.testeRef === t.id)} onEdit={() => { setEditItem(t); setShowFormT(true); }} onDel={() => setConfirmDel({ type: "t", id: t.id, l: t.id })} />
              ))}
              {!filtered.length && <Empty />}
            </div>
          </>
        )}

        {tab === "feeds" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {feeds.map((f) => {
              const o = tests.find((t) => t.id === f.testeRef);
              return <FeedCard key={f.id} f={f} orig={o} onEdit={() => { setEditItem(f); setShowFormF(true); }} onDel={() => setConfirmDel({ type: "f", id: f.id, l: f.id })} />;
            })}
            {!feeds.length && <Empty />}
          </div>
        )}

        {tab === "playbook" && (
          <>
            <p style={{ fontSize: 13, color: "#78776f", margin: "0 0 16px" }}>Soluções validadas (Prática padrão + Sucesso). Ordenadas por taxa de sucesso no reuso.</p>
            {PROBLEMAS.filter((p) => playbook.some((s) => s.problema === p)).map((prob) => {
              const items = playbook.filter((s) => s.problema === prob);
              return (
                <div key={prob} style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "2px solid #1a1a18", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", margin: 0 }}>{prob}</h3>
                    <span style={{ fontSize: 12, color: "#888" }}>{items.length} solução{items.length > 1 ? "ões" : ""}</span>
                  </div>
                  {items.map((s) => (
                    <div key={s.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e7e3", padding: "14px 18px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <Pct value={s.taxaSuc !== null ? s.taxaSuc : (s.totalReuso === 0 ? 100 : 0)} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{s.teste}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.consultor} · {s.nicho} · {s.marketplace}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{s.resultado}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                            <Badge label={s.categoriaSol} bg="#ddeafb" fg="#1a5697" />
                            <Badge
                              label={s.investimento}
                              bg={s.investimento === "Baixo" ? "#dcf5e7" : s.investimento === "Médio" ? "#fef3d6" : "#fce0e0"}
                              fg={s.investimento === "Baixo" ? "#117a3e" : s.investimento === "Médio" ? "#8a6212" : "#932323"}
                            />
                            <Badge label={`~${s.tempoDias}d`} bg="#f0efea" fg="#78776f" />
                            {s.totalReuso > 0 && <Badge label={`${s.totalReuso} reuso${s.totalReuso > 1 ? "s" : ""}`} bg="#eeedfe" fg="#5b4fb0" />}
                          </div>
                        </div>
                      </div>
                      {s.feedbacks.length > 0 && (
                        <div style={{ marginTop: 10, borderTop: "1px solid #f0efea", paddingTop: 8 }}>
                          {s.feedbacks.map((fb, i) => (
                            <div key={i} style={{ fontSize: 12, color: "#666", padding: "3px 0", display: "flex", gap: 6, alignItems: "center" }}>
                              <Badge label={fb.funcionou} {...FUNC_STYLE[fb.funcionou]} />
                              <strong>{fb.consultor}</strong>: {fb.resultado}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            {!playbook.length && <Empty msg="Nenhuma solução validada ainda" />}
          </>
        )}
      </div>

      <TesteForm open={showFormT} onClose={() => { setShowFormT(false); setEditItem(null); }} onSave={saveT} initial={editItem} nextId={nextTId} />
      <FeedForm  open={showFormF} onClose={() => { setShowFormF(false); setEditItem(null); }} onSave={saveF} initial={editItem} nextId={nextFId} tests={tests} />

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Confirmar exclusão">
        <p style={{ fontSize: 14, color: "#444", margin: "0 0 16px" }}>Excluir <strong>{confirmDel?.l}</strong>? Essa ação não pode ser desfeita.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setConfirmDel(null)} style={{ height: 36, padding: "0 18px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
          <button onClick={() => confirmDel.type === "t" ? deleteT(confirmDel.id) : deleteF(confirmDel.id)} style={{ height: 36, padding: "0 18px", borderRadius: 8, border: "none", background: "#e04848", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Excluir</button>
        </div>
      </Modal>
    </div>
  );
}
