import { Popup } from "react-leaflet";

function DetailRow({ label, value }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <strong>{label}:</strong> {value || "-"}
    </div>
  );
}

export function AdminMapFeaturePopup({
  featureInfo,
  clickPosition,
  onClose,
}) {
  if (!featureInfo || !clickPosition) return null;

  return (
    <Popup position={clickPosition} autoPan closeButton onClose={onClose}>
      <div style={{ minWidth: 220 }}>
        <h4 style={{ fontWeight: "bold", fontSize: 14, marginBottom: 10 }}>
          Quarter Details
        </h4>
        <div style={{ fontSize: 12 }}>
          <DetailRow label="Object ID" value={featureInfo.OBJECTID} />
          <DetailRow label="Quarter No" value={featureInfo.QuarterNo} />
          <DetailRow label="Quarter Type" value={featureInfo.QuarterType} />
          <DetailRow label="Area Type" value={featureInfo.AreaType} />
          <DetailRow label="Status" value={featureInfo.Status} />
        </div>
      </div>
    </Popup>
  );
}
