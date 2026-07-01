import { useRef, useState } from "react";

export function useAdminMapPageController() {
  const [featureInfo, setFeatureInfo] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [collapsed, setCollapsed] = useState(() => sessionStorage.getItem("sidenavCollapsed") === "true");
  const highlightLayerRef = useRef(null);

  return {
    featureInfo,
    setFeatureInfo,
    clickPosition,
    setClickPosition,
    collapsed,
    setCollapsed,
    highlightLayerRef,
  };
}
