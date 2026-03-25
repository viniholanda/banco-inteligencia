import { useState, useEffect, useMemo, useCallback } from "react";

import { PROBLEMAS, MARKETPLACES, STATUS_LIST } from "./constants/index.js";
import { INITIAL_TESTS, INITIAL_FEEDS } from "./data/initial.js";
import { FUNC_COLORS } from "./styles/colors.js";
import { loadData, saveData } from "./utils/storage.js";

import DashView from "./components/DashView.jsx";
import TesteCard from "./components/TesteCard.jsx";
import FeedCard from "./components/FeedCard.jsx";
import TesteForm from "./components/TesteForm.jsx";
import FeedForm from "./components/FeedForm.jsx";
import Modal from "./components/ui/Modal.jsx";
import Input from "./components/ui/Input.jsx";
import Select from "./components/ui/Select.jsx";
import Badge from "./components/ui/Badge.jsx";
import Stars from "./components/ui/Stars.jsx";

const TABS = [
  { key: "dash",     label: "Dashboard", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10-1a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1h-4zm-10 9a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zm10-1a1 1 0 00-1 1v5a1 1 0 001 1h4a1 1 0 001-1v-5a1 1 0 00-1-1h-4z" },
  { key: "testes",   label: "Testes",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { key: "feeds",    label: "Feedbacks", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { key: "playbook", label: "Playbook",  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

export default function App() {
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [feeds, setFeeds] = useState(INITIAL_FEEDS);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dash");
  const [showFormTeste, setShowFormTeste] = useState(false);
  const [showFormFeed, setShowFormFeed] = useState(false);
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

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const nextTesteId = useMemo(() => {
    const nums = tests.map((t) => parseInt(t.id.replace("T-", "")) || 0);
    return `T-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
  }, [tests]);

  const nextFeedId = useMemo(() => {
    const nums = feeds.map((f) => parseInt(f.id.replace("F-", "")) || 0);
    return `F-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
  }, [feeds]);

  const filteredTests = useMemo(() => tests.filter((t) => {
    if (fProb && t.problema !== fProb) return false;
    if (fStatus && t.status !== fStatus) return false;
    if (fMkt && t.marketplace !== fMkt) return false;
    if (search && !JSON.stringify(t).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tests, fProb, fStatus, fMkt, search]);

  const kpis = useMemo(() => {
    const n = tests.length;
    const avg = n ? tests.reduce((s, t) => s + t.nota, 0) / n : 0;
    const pos = feeds.filter((f) => f.funcionou === "Sim").length;
    const padrao = tests.filter((t) => t.status === "Prática padrão").length;
    const reuso = n ? feeds.length / n : 0;
    return { n, avg, pos, padrao, reuso, totalFeeds: feeds.length };
  }, [tests, feeds]);

  const chartProblema = useMemo(() => {
    const m = {};
    tests.forEach((t) => { m[t.problema] = (m[t.problema] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [tests]);

  const chartMkt = useMemo(() => {
    const m = {};
    tests.forEach((t) => { m[t.marketplace] = (m[t.marketplace] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [tests]);

  const chartConsultor = useMemo(() => {
    const m = {};
    tests.forEach((t) => {
      if (!m[t.consultor]) m[t.consultor] = { s: 0, c: 0 };
      m[t.consultor].s += t.nota;
      m[t.consultor].c++;
    });
    return Object.entries(m).map(([name, v]) => ({ name, media: Math.round(v.s / v.c * 10) / 10, testes: v.c })).sort((a, b) => b.media - a.media);
  }, [tests]);

  const playbook = useMemo(() => {
    return tests
      .filter((t) => t.status === "Prática padrão" && t.nota >= 4)
      .map((t) => {
        const fb = feeds.filter((f) => f.testeRef === t.id);
        const suc = fb.filter((f) => f.funcionou === "Sim").length;
        return { ...t, feedbacks: fb, totalReuso: fb.length, taxaSuc: fb.length ? Math.round(suc / fb.length * 100) : null };
      })
      .sort((a, b) => b.nota - a.nota || b.totalReuso - a.totalReuso);
  }, [tests, feeds]);

  function saveTeste(data) {
    if (editItem) { setTests((prev) => prev.map((t) => t.id === editItem.id ? { ...t, ...data } : t)); showToast("Teste atualizado"); }
    else { setTests((prev) => [...prev, { ...data, id: nextTesteId }]); showToast("Teste registrado"); }
    setShowFormTeste(false); setEditItem(null);
  }

  function saveFeed(data) {
    if (editItem) { setFeeds((prev) => prev.map((f) => f.id === editItem.id ? { ...f, ...data } : f)); showToast("Feedback atualizado"); }
    else { setFeeds((prev) => [...prev, { ...data, id: nextFeedId }]); showToast("Feedback registrado"); }
    setShowFormFeed(false); setEditItem(null);
  }

  function deleteTeste(id) { setTests((prev) => prev.filter((t) => t.id !== id)); setConfirmDel(null); showToast("Teste removido"); }
  function deleteFeed(id) { setFeeds((prev) => prev.filter((f) => f.id !== id)); setConfirmDel(null); showToast("Feedback removido"); }
  function resetData() { setTests(INITIAL_TESTS); setFeeds(INITIAL_FEEDS); showToast("Dados restaurados"); }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f5f4f0", minHeight: "100vh" }}>

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#1a1a18", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.18)", animation: "fadeIn .2s" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#1a1a18", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.5 }}>Banco de Inteligencia</h1>
          <p style={{ fontSize: 12, color: "#908f8a", margin: "2px 0 0" }}>Grupo Escalada Ecom</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tab === "testes" && (
            <button onClick={() => { setEditItem(null); setShowFormTeste(true); }} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              + Novo teste
            </button>
          )}
          {tab === "feeds" && (
            <button onClick={() => { setEditItem(null); setShowFormFeed(true); }} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", background: "#22c06e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              + Novo feedback
            </button>
          )}
          <button onClick={resetData} style={{ height: 34, padding: "0 12px", borderRadius: 8, border: "1px solid #444", background: "transparent", color: "#908f8a", fontSize: 12, cursor: "pointer" }} title="Restaurar dados iniciais">
            Resetar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: "#fff", borderBottom: "1px solid #e8e7e3", padding: "0 24px", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? "#1a1a18" : "#908f8a", borderBottom: tab === t.key ? "2px solid #1a1a18" : "2px solid transparent", transition: "all .15s" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxWidth: 920, margin: "0 auto" }}>

        {tab === "dash" && (
          <DashView kpis={kpis} chartProblema={chartProblema} chartMkt={chartMkt} chartConsultor={chartConsultor} />
        )}

        {tab === "testes" && (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <Input placeholder="Buscar testes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 180 }} />
              <Select value={fProb} onChange={setFProb} options={PROBLEMAS} placeholder="Problema" />
              <Select value={fStatus} onChange={setFStatus} options={STATUS_LIST} placeholder="Status" />
              <Select value={fMkt} onChange={setFMkt} options={MARKETPLACES} placeholder="Marketplace" />
              {(fProb || fStatus || fMkt || search) && (
                <button onClick={() => { setFProb(""); setFStatus(""); setFMkt(""); setSearch(""); }} style={{ height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 12, cursor: "pointer", color: "#888" }}>
                  Limpar
                </button>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#908f8a", margin: "0 0 10px" }}>
              {filteredTests.length} de {tests.length} teste{tests.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredTests.map((t) => (
                <TesteCard
                  key={t.id}
                  t={t}
                  feeds={feeds.filter((f) => f.testeRef === t.id)}
                  onEdit={() => { setEditItem(t); setShowFormTeste(true); }}
                  onDelete={() => setConfirmDel({ type: "teste", id: t.id, label: t.id })}
                />
              ))}
              {filteredTests.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#bbb", fontSize: 14 }}>Nenhum teste encontrado</div>}
            </div>
          </div>
        )}

        {tab === "feeds" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {feeds.map((f) => {
              const orig = tests.find((t) => t.id === f.testeRef);
              return (
                <FeedCard
                  key={f.id}
                  f={f}
                  orig={orig}
                  onEdit={() => { setEditItem(f); setShowFormFeed(true); }}
                  onDelete={() => setConfirmDel({ type: "feed", id: f.id, label: f.id })}
                />
              );
            })}
            {feeds.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#bbb", fontSize: 14 }}>Nenhum feedback registrado</div>}
          </div>
        )}

        {tab === "playbook" && (
          <div>
            <p style={{ fontSize: 13, color: "#6b6a65", margin: "0 0 16px" }}>Soluções com status "Prática padrão" e nota 4+. Referência rápida para novos mentorados.</p>
            {PROBLEMAS.filter((p) => playbook.some((s) => s.problema === p)).map((prob) => (
              <div key={prob} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", margin: "0 0 8px", padding: "6px 0", borderBottom: "2px solid #1a1a18" }}>{prob}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {playbook.filter((s) => s.problema === prob).map((s) => (
                    <div key={s.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8e7e3", padding: "14px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{s.teste}</div>
                          <div style={{ fontSize: 12, color: "#908f8a", marginTop: 3 }}>{s.consultor} · {s.nicho} · {s.marketplace}</div>
                          <div style={{ fontSize: 12, color: "#6b6a65", marginTop: 4 }}>{s.resultado}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                            <Badge label={s.categoriaSol} bg="#ddeafb" fg="#1a5697" />
                            <Badge
                              label={s.investimento}
                              bg={s.investimento === "Baixo" ? "#ddf4ea" : s.investimento === "Médio" ? "#fef3d8" : "#fce0e0"}
                              fg={s.investimento === "Baixo" ? "#15724a" : s.investimento === "Médio" ? "#8a6212" : "#932323"}
                            />
                            <Badge label={`~${s.tempoDias} dias`} bg="#f0efea" fg="#6b6a65" />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <Stars n={s.nota} size={13} />
                          {s.totalReuso > 0 && <div style={{ fontSize: 11, color: "#15724a", fontWeight: 600, marginTop: 4 }}>{s.totalReuso} reuso{s.totalReuso > 1 ? "s" : ""} · {s.taxaSuc}% sucesso</div>}
                          {s.totalReuso === 0 && <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>Sem reuso ainda</div>}
                        </div>
                      </div>
                      {s.feedbacks.length > 0 && (
                        <div style={{ marginTop: 10, borderTop: "1px solid #f0efea", paddingTop: 8 }}>
                          {s.feedbacks.map((fb, i) => (
                            <div key={i} style={{ fontSize: 12, color: "#6b6a65", padding: "3px 0" }}>
                              <span style={{ fontWeight: 600 }}>{fb.consultor}</span>: {fb.resultado} <Badge label={fb.funcionou} {...FUNC_COLORS[fb.funcionou]} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {playbook.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#bbb" }}>Nenhuma solução validada ainda</div>}
          </div>
        )}
      </div>

      {/* Modais de formulário */}
      <TesteForm
        open={showFormTeste}
        onClose={() => { setShowFormTeste(false); setEditItem(null); }}
        onSave={saveTeste}
        initial={editItem}
        nextId={nextTesteId}
      />
      <FeedForm
        open={showFormFeed}
        onClose={() => { setShowFormFeed(false); setEditItem(null); }}
        onSave={saveFeed}
        initial={editItem}
        nextId={nextFeedId}
        tests={tests}
      />

      {/* Modal de confirmação de exclusão */}
      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Confirmar exclusão">
        <p style={{ fontSize: 14, color: "#444", margin: "0 0 16px" }}>
          Tem certeza que deseja excluir <strong>{confirmDel?.label}</strong>? Essa ação não pode ser desfeita.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setConfirmDel(null)} style={{ height: 36, padding: "0 18px", borderRadius: 8, border: "1px solid #d8d7d2", background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
          <button
            onClick={() => confirmDel.type === "teste" ? deleteTeste(confirmDel.id) : deleteFeed(confirmDel.id)}
            style={{ height: 36, padding: "0 18px", borderRadius: 8, border: "none", background: "#e04848", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
