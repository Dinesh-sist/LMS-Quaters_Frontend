// AdminQuartersSearch.jsx
// Search on the map: pick Quarter Type, Area Type and Quarter No, press Enter.
// The map flies to the building and a pin marks it. No popup opens by itself.
// It does not touch the tiles. One small request runs only when Find is pressed.
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import {
  getQuarterCategories,
  getQuarterAreas,
  getQuarterNumbers,
  getQuarterLocation,
} from "../../../api";

const BUTTON_COLOR = "#1d4ed8";

const boxStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 6,
};
const whiteBox = {
  background: "#fff",
  color: "#222",
  borderRadius: 8,
  boxShadow: "0 1px 5px rgba(0,0,0,0.3)",
  fontFamily: "Arial, sans-serif",
  fontSize: 13,
};
const selectStyle = {
  display: "block",
  width: "100%",
  height: 30,
  marginBottom: 6,
  fontSize: 12,
  color: "#222",
  background: "#fff",
  border: "1px solid #bbb",
  borderRadius: 4,
};

const byNumber = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });

export default function AdminQuartersSearch() {
  const map = useMap();
  const boxRef = useRef(null);
  const firstRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [qno, setQno] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [found, setFound] = useState(null); // { label, buildings }

  // Clicks and scrolls on the search box must not move the map
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
  }, []);

  // When the card opens: load the first list (once) and focus the first dropdown
  useEffect(() => {
    if (!open) return;
    if (categories.length === 0) {
      getQuarterCategories()
        .then((r) => setCategories(r.categories || []))
        .catch(() => setMsg("Could not load the list"));
    }
    firstRef.current?.focus();
  }, [open, categories.length]);

  // A Google Maps style pin marks each found building.
  useEffect(() => {
    if (!found) return undefined;
    const group = L.layerGroup().addTo(map);
    found.buildings.forEach((b) => {
      const center = [(b.minLat + b.maxLat) / 2, (b.minLon + b.maxLon) / 2];
      L.marker(center, {
        interactive: false, // clicks pass through, so the normal popup still works
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48" aria-hidden="true" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))">
              <path fill="#0f172a" stroke="#fff" stroke-width="1.5" d="M18 1C8.6 1 1 8.6 1 18c0 12.2 17 29 17 29s17-16.8 17-29C35 8.6 27.4 1 18 1Z"/>
              <circle cx="18" cy="18" r="6.5" fill="#fff"/>
            </svg>`,
          iconSize: [36, 48],
          iconAnchor: [18, 48],
        }),
      }).addTo(group);
    });
    return () => group.remove();
  }, [found, map]);

  const onCategory = (v) => {
    setCategory(v);
    setArea("");
    setQno("");
    setAreas([]);
    setNumbers([]);
    setMsg("");
    if (v) {
      getQuarterAreas(v)
        .then((r) => setAreas(r.areas || []))
        .catch(() => setMsg("Could not load the list"));
    }
  };

  const onArea = (v) => {
    setArea(v);
    setQno("");
    setNumbers([]);
    setMsg("");
    if (v) {
      getQuarterNumbers(v, category)
        .then((r) => setNumbers((r.numbers || []).slice().sort(byNumber)))
        .catch(() => setMsg("Could not load the list"));
    }
  };

  const doFind = async () => {
    if (!category || !area || !qno) {
      setMsg("Pick all three");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const r = await getQuarterLocation(category, area, qno);
      const list = r.buildings || [];
      if (list.length === 0) {
        setMsg("Quarter not found");
        return;
      }
      const bounds = L.latLngBounds(
        list.flatMap((b) => [
          [b.minLat, b.minLon],
          [b.maxLat, b.maxLon],
        ])
      );
      // Never closer than zoom 20 (the last saved tile level)
      map.flyToBounds(bounds, { maxZoom: 20, padding: [90, 90], duration: 1 });
      setFound({ label: category + " \u00b7 " + area + " \u00b7 " + qno, buildings: list });
      setOpen(false);
    } catch (err) {
      setMsg(/not found/i.test(err?.message || "") ? "Quarter not found" : "Search failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

    // Fly back to the searched building (when the admin clicks the chip)
  const flyBack = () => {
    if (!found) return;
    const bounds = L.latLngBounds(
      found.buildings.flatMap((b) => [
        [b.minLat, b.minLon],
        [b.maxLat, b.maxLon],
      ])
    );
    map.flyToBounds(bounds, { maxZoom: 20, padding: [90, 90], duration: 1 });
  };
  
  const onKeyDown = (e) => {
    e.stopPropagation();
    if (!open) return;
    if (e.key === "Enter") {
      e.preventDefault();
      doFind();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <div ref={boxRef} style={boxStyle} onKeyDown={onKeyDown}>
        {!open ? (
                    <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              ...whiteBox,
              background: "#0f172a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 38,
              padding: "0 14px 0 5px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="10" cy="10" r="7" />
                <line x1="15.5" y1="15.5" x2="21" y2="21" />
              </svg>
            </span>
            Search Quarter
          </button>

        ) : (
          <div style={{ ...whiteBox, width: 190, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <b>Find a quarter</b>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
                style={{ border: "none", background: "none", fontSize: 18, lineHeight: 1, cursor: "pointer", color: "#222" }}
              >
                &times;
              </button>
            </div>

            <select ref={firstRef} style={selectStyle} value={category} onChange={(e) => onCategory(e.target.value)}>
              <option value="">Quarter type</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select style={selectStyle} value={area} disabled={!category} onChange={(e) => onArea(e.target.value)}>
              <option value="">Area type</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select style={selectStyle} value={qno} disabled={!area} onChange={(e) => { setQno(e.target.value); setMsg(""); }}>
              <option value="">Quarter no</option>
              {numbers.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={doFind}
              disabled={busy}
              style={{
                width: "100%",
                height: 30,
                fontSize: 12,
                color: "#fff",
                background: BUTTON_COLOR,
                border: "none",
                borderRadius: 4,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              {busy ? "Finding..." : "Find"}
            </button>
            {msg && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{msg}</div>}
          </div>
        )}

        {found && !open && (
          <div style={{ ...whiteBox, display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", fontSize: 12 }}>
                        <button
              type="button"
              title="Go back to this quarter"
              onClick={flyBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                background: "none",
                padding: 0,
                fontSize: 12,
                color: "#222",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="7" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              {found.label}
            </button>
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setFound(null)}
              style={{ border: "none", background: "none", fontSize: 16, lineHeight: 1, cursor: "pointer", color: "#222" }}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </>
  );
}
