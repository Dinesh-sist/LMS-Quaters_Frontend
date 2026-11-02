import { AdminQuartersTileLayer, AdminQuartersLegend } from "./AdminMapPage/AdminQuartersTileMap";
import AdminQuartersSearch from "./AdminMapPage/AdminQuartersSearch"; // NEW
import { MapContainer, TileLayer } from "./AdminMapPage/AdminMapMapOverlay";
import AdminLayout from "./AdminUI/AdminLayout";

export default function AdminMapPage() {
  return (
    <AdminLayout
      title="Quarters Map View"
      subtitle="Browse quarter polygons and inspect quarter details."
    >
      <section className="relative z-0 isolate overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <div className="relative z-0 isolate h-[70vh] min-h-[520px] w-full">
          <MapContainer
            center={[20.2649, 86.6938]}
            zoom={14}
            maxZoom={22}
            zoomControl={true}
            className="h-full w-full"
            style={{ cursor: "default", outline: "none" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <AdminQuartersTileLayer />
            <AdminQuartersSearch /> {/* NEW */}
          </MapContainer>

          <AdminQuartersLegend />
        </div>
      </section>
    </AdminLayout>
  );
}