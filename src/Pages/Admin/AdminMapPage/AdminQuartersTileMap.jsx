// AdminQuartersTileMap.jsx
// Quarters layer from MapServer + MapCache (saved picture tiles).
// Gives: the tile layer, the click popup and the legend.
import { useEffect, useState } from "react";
import L from "leaflet";
import { TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";

// Address of MapServer and MapCache.
// Empty means "same address as this site" (in development, vite.config.js forwards it to Apache).
const BASE = import.meta.env.VITE_MAPSERVER_BASE ?? "";
const TILE_URL = `${BASE}/mapcache/wmts/1.0.0/quarters/default/GM21/{z}/{y}/{x}.png`;
const WMS_URL = `${BASE}/lms`;

// Area of the quarters (south-west corner, north-east corner)
const QUARTERS_BOUNDS = [
  [20.2571, 86.6414],
  [20.2896, 86.7169],
];

// Legend colors (same as lms.map)
const LEGEND = [
  { color: "#00aa00", label: "Vacant" },
  { color: "#dc0000", label: "Occupied" },
  { color: "#7f77dd", label: "Mixed (vacant and occupied)" },
  { color: "#ff8c00", label: "Beyond Repair" },
  { color: "#969696", label: "Other / Unknown" },
];

// Strip colour for each status (anything else is grey)
const STATUS_COLORS = {
  VACANT: "#00aa00",
  OCCUPIED: "#dc0000",
  "BEYOND REPAIR": "#ff8c00",
};
const OTHER_COLOR = "#969696";
const MIXED_COLOR = "#7f77dd";

// Popup styles
const thStyle = { textAlign: "left", fontWeight: 700, padding: "3px 6px 3px 0", borderBottom: "1px solid #222" };
const tdStyle = { padding: "5px 6px 5px 0", verticalAlign: "top", borderBottom: "1px solid #ddd" };
const chipStyle = {
  display: "inline-block",
  background: "#eee",
  borderRadius: 4,
  padding: "0 6px",
  margin: "2px 3px 2px 0",
  fontSize: 12,
};
const stripStyle = {
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  padding: "5px 10px",
  borderRadius: 4,
  marginBottom: 8,
};

// Fits the map to the quarters area and adds the zoom buttons (bottom left)
function MapHelpers() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(QUARTERS_BOUNDS, { padding: [24, 24] });
    }, 0);
    const zoom = L.control.zoom({ position: "bottomleft" }).addTo(map);
    return () => {
      window.clearTimeout(timer);
      zoom.remove();
    };
  }, [map]);

  return null;
}

// Sort quarter numbers like 2, 10, 11 (not 10, 11, 2)
const sortNos = (list) =>
  [...list].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// "COURT CASE" or "Court case" -> "Court Case"; empty -> "Unknown"
const prettyStatus = (s) => {
  const t = (s || "").trim();
  if (!t) return "Unknown";
  return t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

// The most common non-blank value (a blank Area Type does not split the building)
const commonValue = (values) => {
  const count = {};
  values.forEach((v) => {
    const t = (v || "").trim();
    if (t) count[t] = (count[t] || 0) + 1;
  });
  const best = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
  return best || "-";
};

// Turn the list of quarters at the clicked point into what the popup shows
function buildInfo(rows, latlng) {
  // Group the quarters by status
  const byStatus = {};
  rows.forEach((r) => {
    const key = r.status.trim().toUpperCase() || "UNKNOWN";
    if (!byStatus[key]) {
      byStatus[key] = { key, name: prettyStatus(r.status), color: STATUS_COLORS[key] || OTHER_COLOR, nos: [] };
    }
    byStatus[key].nos.push(r.qno);
  });

  // Vacant first, then Occupied, then the others
  const order = (k) => (k === "VACANT" ? 0 : k === "OCCUPIED" ? 1 : 2);
  const statuses = Object.values(byStatus).sort((a, b) => order(a.key) - order(b.key));

  // Purple building = it has both vacant and occupied quarters
  const isMixed = !!byStatus.VACANT && !!byStatus.OCCUPIED;

  return {
    latlng,
    kind: isMixed ? "mixed" : statuses.length === 1 ? "single" : "multi",
    type: commonValue(rows.map((r) => r.type)),
    area: commonValue(rows.map((r) => r.area)),
    total: rows.length,
    statuses,
  };
}

// Quarter numbers in small boxes
function Chips({ list }) {
  return (
    <>
      {sortNos(list).map((no, i) => (
        <span key={no + "-" + i} style={chipStyle}>{no}</span>
      ))}
    </>
  );
}

// Table with one row per status: colour dot and name, count, quarter numbers in boxes
function StatusTable({ info }) {
  return (
    <>
      <div style={{ fontSize: 12, marginTop: 2 }}>
        <b>Quarter Type:</b> {info.type} &nbsp;|&nbsp; <b>Area Type:</b> {info.area}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0 10px", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, paddingRight: 12 }}>Status</th>
            <th style={{ ...thStyle, padding: "3px 22px", textAlign: "center" }}>Count</th>
            <th style={thStyle}>Quarter No</th>
          </tr>
        </thead>
        <tbody>
          {info.statuses.map((s, i) => {
            const last = i === info.statuses.length - 1;
            const cell = last ? { ...tdStyle, borderBottom: "none" } : tdStyle;
            return (
              <tr key={s.key}>
                <td style={{ ...cell, whiteSpace: "nowrap", paddingRight: 12 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      marginRight: 5,
                      background: s.color,
                    }}
                  />
                  <b>{s.name}</b>
                </td>
                <td style={{ ...cell, padding: "5px 22px", textAlign: "center" }}>{s.nos.length}</td>
                <td style={cell}><Chips list={s.nos} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// Listens for map clicks, asks MapServer which quarters are there, shows the popup
function ClickInfo() {
  // Details of the clicked building (null = no popup)
  const [info, setInfo] = useState(null);

  useMapEvents({
    click(e) {
      // Visible map area (in meters) and clicked pixel
      const map = e.target;
      const size = map.getSize();
      const b = map.getBounds();
      const sw = map.options.crs.project(b.getSouthWest());
      const ne = map.options.crs.project(b.getNorthEast());
      const p = map.latLngToContainerPoint(e.latlng);

      // Ask MapServer for ALL quarters at this pixel (up to 200)
      const url =
        WMS_URL +
        "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo" +
        "&LAYERS=quarters&QUERY_LAYERS=quarters&STYLES=&SRS=EPSG:3857" +
        "&BBOX=" + [sw.x, sw.y, ne.x, ne.y].join(",") +
        "&WIDTH=" + size.x + "&HEIGHT=" + size.y +
        "&X=" + Math.round(p.x) + "&Y=" + Math.round(p.y) +
        "&INFO_FORMAT=application/vnd.ogc.gml&FEATURE_COUNT=200";

      fetch(url)
        .then((r) => r.text())
        .then((txt) => {
          // Read the XML reply into a simple list of quarters
          const xml = new DOMParser().parseFromString(txt, "text/xml");
          const nodes = Array.from(xml.getElementsByTagName("quarters_feature"));

          // No building here: close the popup
          if (!nodes.length) {
            setInfo(null);
            return;
          }

          const rows = nodes.map((n) => {
            const get = (name) => n.getElementsByTagName(name)[0]?.textContent?.trim() ?? "";
            return {
              objectId: get("OBJECT_ID"),
              qno: get("QUARTER_NO"),
              type: get("QUARTER_TYPE"),
              area: get("AREA_TYPE"),
              status: get("STATUS1"),
            };
          });

          setInfo(buildInfo(rows, e.latlng));
        })
        .catch((err) => console.error("GetFeatureInfo failed:", err));
    },
  });

  // Nothing selected: show nothing
  if (!info) return null;

  return (
    <Popup position={info.latlng} minWidth={260} maxHeight={300} eventHandlers={{ remove: () => setInfo(null) }}>
      {info.kind === "mixed" && (
        <>
          {/* Purple building: purple strip, then the table with all statuses */}
          <div style={{ ...stripStyle, background: MIXED_COLOR }}>
            Mixed &middot; {info.total} quarters
          </div>
          <StatusTable info={info} />
        </>
      )}

      {info.kind === "single" && (
        <>
          {/* One status: colour strip, then type, area and quarter numbers in boxes */}
          <div style={{ ...stripStyle, background: info.statuses[0].color }}>
            {info.statuses[0].name} &middot; {info.statuses[0].nos.length}{" "}
            {info.statuses[0].nos.length === 1 ? "quarter" : "quarters"}
          </div>
          <div style={{ lineHeight: 1.55 }}>
            <b>Quarter Type:</b> {info.type}
            <br />
            <b>Area Type:</b> {info.area}
            <br />
            <b>Quarter No:</b>
            <br />
            <Chips list={info.statuses[0].nos} />
          </div>
        </>
      )}

      {info.kind === "multi" && (
        <>
          {/* Two or more statuses, not purple: same table */}
          <b style={{ fontSize: 14 }}>Quarter Details</b>
          <StatusTable info={info} />
        </>
      )}
    </Popup>
  );
}

// Put this INSIDE the MapContainer: tiles, click popup and map helpers
export function AdminQuartersTileLayer() {
  return (
    <>
      <MapHelpers />
      {/* Only saved tiles (zoom 10 to 20) inside the quarters area.
          Closer than zoom 20 the picture is stretched, so no live database query. */}
      <TileLayer
        url={TILE_URL}
        tileSize={256}
        minNativeZoom={10}
        maxNativeZoom={20}
        maxZoom={22}
        bounds={QUARTERS_BOUNDS}
        keepBuffer={6}
      />
      <ClickInfo />
    </>
  );
}

// Put this OUTSIDE the MapContainer (next to it): the legend box
export function AdminQuartersLegend() {
  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 24,
        zIndex: 1000,
        background: "white",
        padding: "8px 10px",
        borderRadius: 4,
        lineHeight: "20px",
        fontSize: 13,
        boxShadow: "0 1px 5px rgba(0,0,0,0.3)",
      }}
    >
      <b>Quarters</b>
      {LEGEND.map((item) => (
        <div key={item.label}>
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              marginRight: 6,
              verticalAlign: "middle",
              background: item.color,
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}