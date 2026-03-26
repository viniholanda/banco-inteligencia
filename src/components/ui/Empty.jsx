export default function Empty({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: 48, color: "#ccc", fontSize: 14 }}>
      {msg || "Nenhum item encontrado"}
    </div>
  );
}
