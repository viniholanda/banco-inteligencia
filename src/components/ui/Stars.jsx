export default function Stars({ n, size = 14, interactive, onChange }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          style={interactive ? { cursor: "pointer" } : {}}
          onClick={interactive ? () => onChange(i) : undefined}
        >
          <polygon
            points="10,2 12.4,7.2 18,7.8 13.8,11.6 15,17.2 10,14.2 5,17.2 6.2,11.6 2,7.8 7.6,7.2"
            fill={i <= n ? "#eaad2b" : "#e0dfda"}
            stroke="none"
          />
        </svg>
      ))}
    </span>
  );
}
