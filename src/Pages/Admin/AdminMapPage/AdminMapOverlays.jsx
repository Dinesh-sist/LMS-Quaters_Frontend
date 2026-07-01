import { QUARTER_STATUS_LEGEND } from "./constants";

export function AdminMapLegend() {
  return (
    <div
      className="min-w-130px max-sm:min-w-100px p-6 max-sm:p-4"
      style={{
        position: "absolute",
        bottom: "7%",
        right: "3%",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      <h4
        className="max-sm:text-[10px] text-[14px]"
        style={{
          fontWeight: "bold",
          marginBottom: 8,
          color: "#0b1f3b",
        }}
      >
        Legend
      </h4>

      {QUARTER_STATUS_LEGEND.map((type) => (
        <div
          className="max-sm:text-[10px] text-[12px]"
          key={type.label}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <div
            className="h-[18px] w-[18px] max-sm:h-[14px] max-sm:w-[14px]"
            style={{
              backgroundColor: type.color,
              border: "2px solid #ccc",
              borderRadius: 4,
              marginRight: 8,
            }}
          />
          {type.label}
        </div>
      ))}
    </div>
  );
}
