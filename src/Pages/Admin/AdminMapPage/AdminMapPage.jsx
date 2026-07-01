import { useAdminMapPageController } from "./useAdminMapPageController";
import { AdminMapFeaturePopup } from "./AdminMapFeaturePopup";
import { AdminMapLegend } from "./AdminMapOverlays";
import { AdminMapMapOverlay, MapContainer, TileLayer } from "./AdminMapMapOverlay";

export default function AdminMapPage() {
  const controller = useAdminMapPageController();

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-indigo-100/70 z-10">
            <div className="shadow-sm rounded-2xl w-full flex flex-col h-full">
              <div className="relative h-[70vh] min-h-[520px] w-full">
                <MapContainer
                  center={[20.2649, 86.6935]}
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
