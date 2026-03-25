import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PIE_COLORS } from "../styles/colors.js";

export default function DashView({ kpis, chartProblema, chartMkt, chartConsultor }) {
  const kpiCards = [
    { label: "Total de testes",      value: kpis.n,                          color: "#2D5AA0" },
    { label: "Nota média",           value: kpis.avg.toFixed(1),             color: "#8B7EC8" },
    { label: "Total feedbacks",      value: kpis.totalFeeds,                 color: "#5BA07D" },
    { label: "Feedbacks positivos",  value: kpis.pos,                        color: "#22c06e" },
    { label: "Taxa de reuso",        value: Math.round(kpis.reuso * 100) + "%", color: "#D4804E" },
    { label: "Práticas padrão",      value: kpis.padrao,                     color: "#1a1a18" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginBottom: 20 }}>
        {kpiCards.map((k) => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e8e7e3" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#908f8a", textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color, marginTop: 4, lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", margin: "0 0 12px" }}>Testes por problema</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartProblema} cx="50%" cy="50%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={2} stroke="none">
                {chartProblema.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e8e7e3" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 6 }}>
            {chartProblema.map((d, i) => (
              <span key={d.name} style={{ fontSize: 11, color: "#6b6a65", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", margin: "0 0 12px" }}>Nota média por consultor</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartConsultor} layout="vertical" margin={{ left: 8, right: 12, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efea" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: "#908f8a" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b6a65" }} width={70} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e8e7e3" }} />
              <Bar dataKey="media" fill="#2D5AA0" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8e7e3" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", margin: "0 0 12px" }}>Testes por marketplace</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartMkt} margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0efea" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b6a65" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#908f8a" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e8e7e3" }} />
            <Bar dataKey="value" fill="#D4804E" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
