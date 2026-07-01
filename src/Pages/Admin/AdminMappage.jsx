import { useAdminMapPageController } from "./AdminMapPage/useAdminMapPageController";
import { AdminMapFeaturePopup } from "./AdminMapPage/AdminMapFeaturePopup";
import { AdminMapLegend } from "./AdminMapPage/AdminMapOverlays";
import { AdminMapMapOverlay, MapContainer, TileLayer } from "./AdminMapPage/AdminMapMapOverlay";
import AdminLayout from "./AdminUI/AdminLayout";

export default function AdminMapPage() {
  const controller = useAdminMapPageController();

  return (
    <AdminLayout
      title="Quarters Map View"
      subtitle="Browse quarter polygons from Estate_Quarters and inspect unit details."
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <div className="relative h-[70vh] min-h-[520px] w-full">
          <MapContainer
            center={[20.2649, 86.6938]}
            zoom={14}
            maxZoom={22}
            zoomControl={false}
            className="h-full w-full"
            style={{ cursor: "default", outline: "none" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <AdminMapMapOverlay
              setFeatureInfo={controller.setFeatureInfo}
              setClickPosition={controller.setClickPosition}
              highlightLayerRef={controller.highlightLayerRef}
            />

            <AdminMapFeaturePopup
              featureInfo={controller.featureInfo}
              clickPosition={controller.clickPosition}
              onClose={() => {
                controller.setFeatureInfo(null);
                controller.setClickPosition(null);
                if (controller.highlightLayerRef.current) {
                  controller.highlightLayerRef.current.remove();
                  controller.highlightLayerRef.current = null;
                }
              }}
            />
          </MapContainer>

          <AdminMapLegend />
        </div>
      </section>
    </AdminLayout>
  );
}
