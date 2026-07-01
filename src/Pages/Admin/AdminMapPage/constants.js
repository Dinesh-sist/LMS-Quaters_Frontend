export const COLOR_OCCUPIED = "#dc2626";
export const COLOR_VACANT = "#16a34a";
export const COLOR_BEYOND_REPAIR = "#f59e0b";
export const COLOR_UNKNOWN = "#64748b";
export const STROKE_DEFAULT = "#0f172a";

export const QUARTER_STATUS_LEGEND = [
  { color: COLOR_VACANT, label: "Vacant" },
  { color: COLOR_OCCUPIED, label: "Occupied" },
  { color: COLOR_BEYOND_REPAIR, label: "Beyond Repair" },
  { color: COLOR_UNKNOWN, label: "Other / Unknown" },
];

export function getQuarterStatusStyle(status) {
  const normalized = String(status || "").trim().toUpperCase();

  if (normalized === "VACANT") {
    return { fillColor: COLOR_VACANT, color: STROKE_DEFAULT, fillOpacity: 0.8 };
  }

  if (normalized === "OCCUPIED") {
    return { fillColor: COLOR_OCCUPIED, color: STROKE_DEFAULT, fillOpacity: 0.82 };
  }

  if (normalized === "BEYOND REPAIR") {
    return { fillColor: COLOR_BEYOND_REPAIR, color: STROKE_DEFAULT, fillOpacity: 0.82 };
  }

  return { fillColor: COLOR_UNKNOWN, color: STROKE_DEFAULT, fillOpacity: 0.7 };
}
