import { useAdminMapPageController } from "./useAdminMapPageController";
import { AdminMapFeaturePopup } from "./AdminMapFeaturePopup";
import { AdminMapLegend } from "./AdminMapOverlays";
import { AdminMapMapOverlay, MapContainer, TileLayer } from "./AdminMapMapOverlay";
import { AdminQuartersTileLayer, AdminQuartersLegend } from "./AdminQuartersTileMap";

// true  = quarters come from MapServer tiles (new map, with mixed buildings)
// false = old map that draws the shapes from the API (fallback)
const USE_MAPSERVER_TILES = true;

export default function AdminMapPage() {
  console.log("ADMIN MAP PAGE IS LOADING");
  const controller = useAdminMapPageController();

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-indigo-100/70 z-10">
            <div className="shadow-sm rounded-2xl w-full flex flex-col h-full">
              <div className="relative z-0 isolate h-[70vh] min-h-[520px] w-full">
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

                  {USE_MAPSERVER_TILES ? (
                    <AdminQuartersTileLayer />
                  ) : (
                    <>
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
                    </>
                  )}
                </MapContainer>

                {USE_MAPSERVER_TILES ? <AdminQuartersLegend /> : <AdminMapLegend />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}