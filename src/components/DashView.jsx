import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import KpiCard from "./ui/KpiCard.jsx";
import BarPct from "./ui/BarPct.jsx";

export default function DashView({ globalSuccess, feedSuccess, tests, feeds, byProblema, byConsultor, byMkt }) {
  return (
    <>
      {/* KPI ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 18 }}>
        <KpiCard
          label="Taxa de sucesso geral"
          main={globalSuccess.rate + "%"}
          sub={`${globalSuccess.sucesso} de ${globalSuccess.total} testes`}
          color={globalSuccess.rate >= 70 ? "#16a050" : "#d49424"}
          ring={globalSuccess.rate}
        />
        <KpiCard
          label="Sucesso no reuso"
          main={feedSuccess.rate + "%"}
          sub={`${feedSuccess.ok || 0} de ${feedSuccess.total} feedbacks`}
          color={feedSuccess.rate >= 70 ? "#16a050" : "#d49424"}
          ring={feedSuccess.rate}
        />
        <KpiCard
          label="Total de testes"
          main={tests.length}
          sub={`${tests.filter((t) => t.status === "Prática padrão").length} virou prática padrão`}
          color="#2563eb"
        />
        <KpiCard
          label="Total de feedbacks"
          main={feeds.length}
          sub={`Taxa de reuso: ${tests.length ? Math.round(feeds.length / tests.length * 100) : 0}%`}
          color="#7c5ec4"
        />
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {/* Success by problem */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: "#1a1a18" }}>% sucesso por problema</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {byProblema.map((p) => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "#444", fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontWeight: 700, color: p.rate >= 70 ? "#16a050" : p.rate >= 40 ? "#8a6212" : "#932323" }}>
                    {p.rate}%<span style={{ fontWeight: 400, color: "#aaa", marginLeft: 4 }}>({p.total})</span>
                  </span>
                </div>
                <BarPct value={p.rate} color={p.rate >= 70 ? "#16a050" : p.rate >= 40 ? "#d49424" : "#e04848"} />
              </div>
            ))}
          </div>
        </div>

        {/* Success by consultant */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: "#1a1a18" }}>% sucesso por consultor</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {byConsultor.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#f0efea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6b6a65", flexShrink: 0 }}>
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500, color: "#333" }}>{c.name}</span>
                    <span style={{ fontWeight: 700, color: c.rate >= 70 ? "#16a050" : c.rate >= 40 ? "#8a6212" : "#932323" }}>{c.rate}%</span>
                  </div>
                  <BarPct value={c.rate} color={c.rate >= 70 ? "#16a050" : c.rate >= 40 ? "#d49424" : "#e04848"} height={5} />
                </div>
                <span style={{ fontSize: 11, color: "#bbb", flexShrink: 0 }}>{c.total}t</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* By marketplace */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: "#1a1a18" }}>Testes por marketplace</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={byMkt} margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efea" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#bbb" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e8e7e3" }} formatter={(v, n) => n === "total" ? [v, "Testes"] : [v + "%", "Sucesso"]} />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution pie */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: "#1a1a18" }}>Distribuição de resultados</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="55%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Sucesso",  value: globalSuccess.sucesso },
                    { name: "Parcial",  value: globalSuccess.parcial },
                    { name: "Fracasso", value: globalSuccess.fracasso },
                  ].filter((d) => d.value > 0)}
                  cx="50%" cy="50%" outerRadius={55} innerRadius={32} dataKey="value" paddingAngle={3} stroke="none"
                >
                  <Cell fill="#16a050" />
                  <Cell fill="#d49424" />
                  <Cell fill="#e04848" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Sucesso", "#16a050", globalSuccess.sucesso], ["Parcial", "#d49424", globalSuccess.parcial], ["Fracasso", "#e04848", globalSuccess.fracasso]].map(([l, c, v]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }} />
                  <span style={{ color: "#666" }}>{l}</span>
                  <span style={{ fontWeight: 700, color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
