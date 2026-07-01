import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Wkt from "wicket";
import { request } from "../../../api";
import { getQuarterStatusStyle } from "./constants";

function BottomRightZoomControl() {
  const map = useMap();

  useEffect(() => {
    const zoom = L.control.zoom({ position: "bottomleft" }).addTo(map);
    return () => zoom.remove();
  }, [map]);

  return null;
}

function EnsureMapLayout() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function MapPolygonsLayer({ setFeatureInfo, setClickPosition, highlightLayerRef }) {
  const [quarterData, setQuarterData] = useState([]);
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuarterData() {
      try {
        const rows = await request("/api/map/wkt", { auth: true });
        if (!cancelled) {
          setQuarterData(Array.isArray(rows) ? rows : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching quarter map data:", err);
          setQuarterData([]);
        }
      }
    }

    fetchQuarterData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!map) return undefined;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!quarterData.length) return undefined;

    const group = L.featureGroup();

    quarterData.forEach((row) => {
      if (!row?.Shape) return;

      try {
        const wicket = new Wkt.Wkt();
        wicket.read(row.Shape);
        const geojson = wicket.toJson();
        if (!geojson) return;

        const statusStyle = getQuarterStatusStyle(row.Status);
        const polygon = L.geoJSON(geojson, {
          pointToLayer: (_feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 3,
              color: statusStyle.color,
              fillColor: statusStyle.fillColor,
              fillOpacity: statusStyle.fillOpacity,
              weight: 1,
            }),
          style: {
            fillColor: statusStyle.fillColor,
            color: statusStyle.color,
            fillOpacity: statusStyle.fillOpacity,
            weight: 1.2,
            opacity: 0.95,
          },
          onEachFeature: (_feature, layer) => {
            layer.on("click", (e) => {
              if (highlightLayerRef.current) {
                map.removeLayer(highlightLayerRef.current);
                highlightLayerRef.current = null;
              }

              const highlight = L.geoJSON(geojson, {
                pointToLayer: (_innerFeature, latlng) =>
                  L.circleMarker(latlng, {
                    radius: 4,
                    color: "#111827",
                    fillColor: "#111827",
                    fillOpacity: 0.2,
                    weight: 2,
                  }),
                style: {
                  color: "#111827",
                  weight: 2,
                  fillColor: "#111827",
                  fillOpacity: 0.18,
                },
              }).addTo(map);

              highlightLayerRef.current = highlight;
              setFeatureInfo(row);
              setClickPosition(e.latlng);
            });
          },
        });

        if (polygon) {
          group.addLayer(polygon);
        }
      } catch (err) {
        console.error(`WKT parse error for OBJECTID=${row?.OBJECTID ?? "unknown"}:`, err);
      }
    });

    if (!group.getLayers().length) return undefined;

    group.addTo(map);
    layerRef.current = group;

    const bounds = group.getBounds?.();
    if (bounds && bounds.isValid && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, quarterData, setFeatureInfo, setClickPosition, highlightLayerRef]);

  return null;
}

export function AdminMapMapOverlay({
  setFeatureInfo,
  setClickPosition,
  highlightLayerRef,
}) {
  return (
    <>
      <EnsureMapLayout />
      <MapPolygonsLayer
        setFeatureInfo={setFeatureInfo}
        setClickPosition={setClickPosition}
        highlightLayerRef={highlightLayerRef}
      />
      <BottomRightZoomControl />
    </>
  );
}

export { MapContainer, TileLayer };
