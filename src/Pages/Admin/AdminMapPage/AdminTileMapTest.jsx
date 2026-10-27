// AdminTileMapTest.jsx - test page: OSM + MapCache tiles + MapServer click popup
import { useState } from "react";
import { MapContainer, TileLayer, Popup, useMapEvents } from "react-leaflet";

// MapCache tiles (saved pictures of the quarters layer)
const TILE_URL =
  "http://localhost/mapcache/wmts/1.0.0/quarters/default/GM21/{z}/{y}/{x}.png";

// MapServer link, used only for the click popup
const WMS_URL = "http://localhost/lms";

// Legend colors (same as lms.map)
const LEGEND = [
  { color: "#00aa00", label: "Vacant" },
  { color: "#dc0000", label: "Occupied" },
  { color: "#7f77dd", label: "Mixed (vacant and occupied)" },
  { color: "#ff8c00", label: "Beyond Repair" },
  { color: "#969696", label: "Other / Unknown" },
];

// Legend box at the bottom right of the map
function TileMapLegend() {
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

// Turn the list of quarters at the clicked point into what the popup shows
function buildInfo(rows, latlng) {
  const vacant = rows.filter((r) => r.status === "VACANT");
  const occupied = rows.filter((r) => r.status === "OCCUPIED");

  // Fully vacant, fully occupied or other: same popup as before
  if (vacant.length === 0 || occupied.length === 0) {
    return { latlng, mixed: false, row: rows[0] };
  }

  // Mixed building: show the smaller group (equal counts: show vacant)
  const showVacant = vacant.length <= occupied.length;
  const group = showVacant ? vacant : occupied;

  // Group by quarter type and area type, so each is shown once
  const byKey = {};
  group.forEach((r) => {
    const key = r.type + "|" + r.area;
    if (!byKey[key]) byKey[key] = { type: r.type, area: r.area, nos: [] };
    byKey[key].nos.push(r.qno);
  });
  const groups = Object.values(byKey);
  groups.forEach((g) =>
    g.nos.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  );

  return {
    latlng,
    mixed: true,
    vacantCount: vacant.length,
    occupiedCount: occupied.length,
    label: showVacant ? "vacant" : "occupied",
    shownCount: group.length,
    groups,
  };
}

// Listens for map clicks and shows the building details popup
function ClickInfo() {
  // Details of the clicked building (null = no popup)
  const [info, setInfo] = useState(null);

  useMapEvents({
    click(e) {
      // Visible map area and clicked pixel
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
            const get = (name) => n.getElementsByTagName(name)[0]?.textContent ?? "";
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
    <Popup position={info.latlng} eventHandlers={{ remove: () => setInfo(null) }}>
      <b>Quarter Details</b>
      <br />
      {info.mixed ? (
        <>
          {info.vacantCount} vacant, {info.occupiedCount} occupied
          <br />
          Showing the {info.shownCount} {info.label} quarters
          <br />
          <br />
          {info.groups.map((g) => (
            <div key={g.type + g.area} style={{ marginBottom: 8 }}>
              Quarter Type: {g.type}
              <br />
              Area Type: {g.area}
              <br />
              Quarter No: {g.nos.join(", ")}
            </div>
          ))}
        </>
      ) : (
        <>
          Object ID: {info.row.objectId}
          <br />
          Quarter No: {info.row.qno}
          <br />
          Quarter Type: {info.row.type}
          <br />
          Area Type: {info.row.area}
          <br />
          Status: {info.row.status}
        </>
      )}
    </Popup>
  );
}

// The page: base map + our tiles + click popup + legend
export default function AdminTileMapTest() {
  return (
    <div className="relative h-screen w-full">
      <MapContainer center={[20.2649, 86.6935]} zoom={14} maxZoom={22} className="h-full w-full">
        {/* Base map: OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Quarters layer: tiles exist up to zoom 21, buffer keeps panning smooth */}
        <TileLayer
          url={TILE_URL}
          maxNativeZoom={21}
          maxZoom={22}
          keepBuffer={6}
          updateWhenZooming={false}
        />

        {/* Click popup */}
        <ClickInfo />
      </MapContainer>

      {/* Legend */}
      <TileMapLegend />
    </div>
  );
}