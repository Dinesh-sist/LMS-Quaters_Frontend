/**
 * AgGridTable.jsx  —  ag-grid-community v35 compatible
 *
 * BASE  : File 1 (ag-theme-alpine, computedColumnWidths, custom pagination,
 *                  floating filters, column toggle, scroll wrapper, CSS block)
 * ADDED : File 2's themeQuartz, BadgeCellRenderer / EmpIdCellRenderer /
 *          ClassCellRenderer / BasicCellRenderer / ActionCellRenderer,
 *          ToolbarButton, panel header, toolbar search + export/filter buttons.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { TableSectionSkeleton } from "./PageSkeleton";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// ── Purple themeQuartz (from file 2) ────────────────────────
const purpleTheme = themeQuartz.withParams({
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  fontSize: 13,
  rowHeight: 48,
  rowVerticalPaddingScale: 0,
  headerHeight: 44,
  headerBackgroundColor: "#f9fafb",
  headerTextColor: "#6b7280",
  headerFontSize: 11,
  headerFontWeight: 700,
  backgroundColor: "#ffffff",
  oddRowBackgroundColor: "#fafaff",
  rowHoverColor: "rgba(139,92,246,0.05)",
  selectedRowBackgroundColor: "#ede9fe",
  borderColor: "#f3f4f6",
  cellHorizontalPaddingScale: 1.3,
  accentColor: "#6d28d9",
  foregroundColor: "#374151",
  chromeBackgroundColor: "rgba(249,250,251,0.5)",
  borderRadius: 0,
  wrapperBorderRadius: 0,
  columnBorder: false,
  headerColumnBorder: false,
  sidePanelBorder: false,
});

/* ── Cell Renderers (from file 2) ───────────────────────────── */

function BadgeCellRenderer({ value }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%",
      background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
      color: "#fff", fontSize: 11, fontWeight: 700,
      boxShadow: "0 2px 6px rgba(109,40,217,0.35)",
      flexShrink: 0,
    }}>
      {value}
    </span>
  );
}

function EmpIdCellRenderer({ value }) {
  return (
    <span style={{
      padding: "2px 8px", background: "#ede9fe", color: "#6d28d9",
      borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {value}
    </span>
  );
}

function ClassCellRenderer({ value }) {
  const isSr1 = value === "SR-CLASS-I";
  return (
    <span style={{
      padding: "2px 8px",
      background: isSr1 ? "#dbeafe" : "#ffedd5",
      color: isSr1 ? "#1d4ed8" : "#c2410c",
      borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {value}
    </span>
  );
}

function BasicCellRenderer({ value }) {
  return (
    <span style={{ color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
      ₹{Number(value).toLocaleString("en-IN")}
    </span>
  );
}

function ActionCellRenderer() {
  return (
    <button
      style={{
        padding: "4px 14px", fontSize: 11, fontWeight: 600,
        color: "#fff", background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
        border: "none", borderRadius: 8, cursor: "pointer",
        boxShadow: "0 1px 4px rgba(79,70,229,0.3)", transition: "opacity 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      Review
    </button>
  );
}

const RENDERER_MAP = {
  badge: BadgeCellRenderer,
  empId: EmpIdCellRenderer,
  class: ClassCellRenderer,
  basic: BasicCellRenderer,
  action: ActionCellRenderer,
};



const COLUMN_KEY_FALLBACK_PREFIX = "column";
const MAX_CONTENT_WIDTH = 720;
const CELL_PADDING = 56;
const CONTENT_FONT = "500 13px 'Segoe UI', system-ui, sans-serif";
const normalizedRowKeyCache = new WeakMap();

function normalizeColumnToken(value) {
  return String(value ?? "")
    .replace(/[\s_-]+/g, "")
    .toLowerCase();
}

function getColumnKey(column, index) {
  const fallback = `${COLUMN_KEY_FALLBACK_PREFIX}_${index}`;
  return String(
    column?.key ??
    column?.Key ??
    column?.field ??
    column?.Field ??
    column?.dataKey ??
    column?.dataField ??
    fallback
  );
}

function getColumnHeader(column, fallbackKey) {
  return column?.header || column?.label || fallbackKey;
}

function getPreferredFieldNames(column, fallbackKey) {
  return [
    column?.field,
    column?.Field,
    column?.dataKey,
    column?.dataField,
    column?.key,
    column?.Key,
    fallbackKey,
  ]
    .filter((value) => value != null && value !== "")
    .map(String)
    .filter((value, index, allValues) => allValues.indexOf(value) === index);
}

function getNormalizedRowKeyMap(row) {
  if (!row || typeof row !== "object") return new Map();

  let cached = normalizedRowKeyCache.get(row);
  if (!cached) {
    cached = new Map(
      Object.keys(row).map((key) => [normalizeColumnToken(key), key])
    );
    normalizedRowKeyCache.set(row, cached);
  }

  return cached;
}

function getRowValue(row, column, fallbackKey) {
  if (typeof column?.value === "function") {
    return column.value(row);
  }

  if (!row || typeof row !== "object") return undefined;

  const fieldNames = getPreferredFieldNames(column, fallbackKey);

  for (const fieldName of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(row, fieldName)) {
      return row[fieldName];
    }
  }

  const normalizedRowKeys = getNormalizedRowKeyMap(row);
  for (const fieldName of fieldNames) {
    const matchedKey = normalizedRowKeys.get(normalizeColumnToken(fieldName));
    if (matchedKey) {
      return row[matchedKey];
    }
  }

  return undefined;
}

function getDisplayText(value, column) {
  if (value == null) return "";

  if (column?.renderer === "basic") {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
      ? `₹${numericValue.toLocaleString("en-IN")}`
      : String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function measureTextWidth(text) {
  if (typeof document === "undefined") {
    return String(text ?? "").length * 8;
  }

  const canvas =
    measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");

  if (!context) {
    return String(text ?? "").length * 8;
  }

  context.font = CONTENT_FONT;
  return Math.ceil(context.measureText(String(text ?? "")).width);
}

/* ── Toolbar button (from file 2) ───────────────────────────── */


/* ── Main component ─────────────────────────────────────────── */
export default function AgGridTable({
  // ── File 1 props ──
  columns,
  rows,
  rowKey,
  emptyMessage = "No records found.",
  contentAutoWidth = true,
  contentAlign = "center",
  // ── File 2 props (header / toolbar) ──
  badgeText = "",
  badgeLabel = "",
  searchable = true,
  pageSize = 10,
  showExport = true,
  showFilter = true,
  loading = false,
  searchPlaceholder = "Search name, ID, app no...",
}) {
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState("");
  const [pageSizeState] = useState(pageSize);
  const [pageLabel, setPageLabel] = useState("1 / 1");
  const [rowRangeLabel, setRowRangeLabel] = useState("0–0 of 0");
  const [showColMenu, setShowColMenu] = useState(false);
  const normalizedColumns = useMemo(
    () =>
      columns.map((col, index) => {
        const fieldKey = getColumnKey(col, index);
        return {
          ...col,
          __colId: `${fieldKey}__${index}`,
          __fieldKey: fieldKey,
          __headerName: getColumnHeader(col, fieldKey),
        };
      }),
    [columns]
  );
  const [visibleCols, setVisibleCols] = useState(
    () => new Set(normalizedColumns.map((col) => col.__colId))
  );

  // ── Content-aware width computation (file 1 replacement) ────
  const computedColumnWidths = useMemo(() => {
    return normalizedColumns.reduce((acc, col) => {
      if (col.__fieldKey === "action" || col.renderer === "action") {
        acc[col.__colId] = col.width || 220;
        return acc;
      }

      const baseWidth = col.width || col.minWidth || 140;
      let widestCell = 0;

      for (const row of rows) {
        const rawValue = getRowValue(row, col, col.__fieldKey);
        const text = getDisplayText(rawValue, col);
        widestCell = Math.max(widestCell, measureTextWidth(text));
      }

      acc[col.__colId] = Math.max(
        baseWidth,
        Math.min(MAX_CONTENT_WIDTH, widestCell + CELL_PADDING)
      );
      return acc;
    }, {});
  }, [normalizedColumns, rows]);

  const serialValueGetter = useCallback(
    (params) => {
      const idx = typeof params?.node?.rowIndex === "number" ? params.node.rowIndex : 0;
      return idx + 1;
    },
    []
  );


  // ── Column definitions (file 1 logic + file 2 renderers) ────
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        field: "__sno",
        minWidth: 90,
        width: 90,
        suppressSizeToFit: true,
        flex: 0,
        sortable: false,
        filter: false,
        floatingFilter: false,
        suppressMenu: true,
        resizable: false,
        valueGetter: serialValueGetter,
        pinned: "left",
      },
      ...normalizedColumns.map((col) => {
        const isAction = col.__fieldKey === "action" || col.renderer === "action";
        const actionWidth = col.width || 220;
        const computedWidth = isAction
          ? actionWidth
          : Math.max(col.minWidth || 140, computedColumnWidths[col.__colId] || col.width || 140);

        const def = {
          colId: col.__colId,
          headerName: col.__headerName,
          field: col.__fieldKey,
          minWidth: computedWidth,
          width: computedWidth,
          flex: 0,
          suppressSizeToFit: true,
          sortable: col.sortable !== false,
          filter: showFilter && col.filterable !== false ? "agTextColumnFilter" : false,
          floatingFilter: showFilter && col.filterable !== false,
          suppressMenu: !showFilter,
          resizable: false,
          suppressMovable: true,
          valueGetter: (params) => getRowValue(params.data, col, col.__fieldKey),
        };

        if (!contentAutoWidth) {
          def.flex = typeof col.flex === "number" ? col.flex : 1;
          delete def.width;
          def.minWidth = col.minWidth || 140;
        }

        // ── Prefer RENDERER_MAP (file 2 chips/badges) then col.render ──
        if (col.renderer && RENDERER_MAP[col.renderer]) {
          def.cellRenderer = RENDERER_MAP[col.renderer];
        } else if (typeof col.render === "function") {
          def.cellRenderer = (params) => col.render(params.value, params.data, params);
        } else {
          def.cellRenderer = (params) => {
            const val = params.value;
            if (val === null || val === undefined || val === "") {
              return <span className="text-slate-400 text-xs font-semibold">—</span>;
            }
            return getDisplayText(val, col);
          };
        }

        if (col.pinned) def.pinned = col.pinned;

        return def;
      }),
    ],
    [computedColumnWidths, contentAutoWidth, normalizedColumns, serialValueGetter, showFilter]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: false,
      minWidth: 140,
      filterParams: { buttons: ["reset"] },
    }),
    []
  );

  const getRowId = useMemo(() => {
    if (typeof rowKey === "function") {
      return (params) => {
        const id = rowKey(params.data, params.rowIndex);
        return id == null || id === "" ? String(params.rowIndex) : String(id);
      };
    }
    return undefined;
  }, [rowKey]);

  const autoSizeVisibleColumns = useCallback(() => {
    if (!contentAutoWidth) return;

    const scheduleResize =
      typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame
        : (callback) => setTimeout(callback, 0);

    scheduleResize(() => {
      const api = gridRef.current?.api;
      if (!api || typeof api.getAllDisplayedColumns !== "function") return;

      const displayedColumnIds = api
        .getAllDisplayedColumns()
        .map((column) => column.getColId())
        .filter((columnId) => columnId !== "__sno");

      if (!displayedColumnIds.length) return;

      if (typeof api.autoSizeColumns === "function") {
        api.autoSizeColumns(displayedColumnIds, false);
      } else if (typeof api.autoSizeAllColumns === "function") {
        api.autoSizeAllColumns(false);
      }
    });
  }, [contentAutoWidth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCols(new Set(normalizedColumns.map((col) => col.__colId)));
  }, [normalizedColumns]);


  // ── Pagination labels (file 1) ───────────────────────────────
  const updatePaginationLabels = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    const totalRows = api.getDisplayedRowCount();
    const totalPages = Math.max(api.paginationGetTotalPages(), 1);
    const currentPg = api.paginationGetCurrentPage() + 1;
    setPageLabel(`${currentPg}/${totalPages}`);
    if (totalRows === 0) { setRowRangeLabel("0 of 0"); return; }
    const start = api.paginationGetCurrentPage() * pageSizeState + 1;
    const end = Math.min(start + pageSizeState - 1, totalRows);
    setRowRangeLabel(`${start}–${end} of ${totalRows}`);
  }, [pageSizeState]);

  const onGridReady = useCallback(() => {
    updatePaginationLabels();
    autoSizeVisibleColumns();
  }, [autoSizeVisibleColumns, updatePaginationLabels]);
  const onFirstDataRendered = useCallback(() => {
    updatePaginationLabels();
    autoSizeVisibleColumns();
  }, [autoSizeVisibleColumns, updatePaginationLabels]);
  const onFilterChanged = useCallback(() => updatePaginationLabels(), [updatePaginationLabels]);
  const onPaginationChanged = useCallback(() => updatePaginationLabels(), [updatePaginationLabels]);
  const onModelUpdated = useCallback(() => updatePaginationLabels(), [updatePaginationLabels]);
  const onGridSizeChanged = useCallback(() => updatePaginationLabels(), [updatePaginationLabels]);

  const toggleColumn = useCallback((columnId) => {
    const api = gridRef.current?.api;
    if (!api) return;
    setVisibleCols((prev) => {
      const next = new Set(prev);
      const shouldShow = !next.has(columnId);
      if (shouldShow) next.add(columnId); else next.delete(columnId);
      api.setColumnsVisible([columnId], shouldShow);
      autoSizeVisibleColumns();
      return next;
    });
  }, [autoSizeVisibleColumns]);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.setGridOption("quickFilterText", quickFilter);
  }, [quickFilter]);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.paginationSetPageSize(pageSizeState);
    api.paginationGoToFirstPage();
  }, [pageSizeState]);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    if (rows.length === 0) api.showNoRowsOverlay();
    else api.hideOverlay();
    api.refreshCells({ force: true });
    autoSizeVisibleColumns();
  }, [autoSizeVisibleColumns, rows]);

  const onExportCSV = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({
    });
  });

  const alignClass = contentAlign === "left" ? "lms-grid-align-left" : "lms-grid-align-center";

  if (loading) {
    return (
      <TableSectionSkeleton
        searchable={searchable}
        rowCount={pageSizeState}
        columnCount={columns.length + 1}
      />
    );
  }

  return (
    <>
      {/* ── All CSS from file 1 (untouched) ── */}
      <style>{`
        @media screen and (max-width: 1024px) { .lms-grid-root { font-size: 90%; } }
        @media screen and (max-width: 700px)  { .lms-grid-root { font-size: 80%; } }
        @media screen and (max-width: 640px)  { .lms-grid-root { font-size: 70%; } }

        .lms-grid-scroll {
          overflow-x: auto; overflow-y: hidden; width: 100%;
          -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;
        }
        .lms-grid-scroll::-webkit-scrollbar { height: 4px; }
        .lms-grid-scroll::-webkit-scrollbar-thumb { background: #c7c4f0; border-radius: 2px; }
        .lms-grid-scroll::-webkit-scrollbar-track { background: transparent; }

        .lms-grid { min-width: 100%; overflow: hidden; border-radius: 20px; }

        .lms-grid .ag-root-wrapper {
          width: max-content !important; min-width: 100% !important;
          overflow: auto !important; border: none !important;
          border-radius: 0 0 20px 20px !important;
          font-family: inherit !important; background: #ffffff !important;
        }

        .lms-grid .ag-cell.ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell) {
          border-right: 1px solid #babfc7 !important;
        }
        .ag-body-horizontal-scroll-viewport { color: #463ca6; }
        .ag-horizontal-left-spacer { overflow-x: hidden !important; }

        .lms-grid .ag-header {
          background: #1b2d69 !important; border-bottom: 1px solid #f3f4f6 !important;
          min-height: 44px !important;
        }
        .lms-grid .ag-header-cell-label { justify-content: center !important; }
        .lms-grid .ag-header-cell {
          font-size: 11px !important; font-weight: 800 !important;
          letter-spacing: 0.1em !important; text-transform: uppercase !important;
          color: #f5f5ff !important; padding: 0 24px !important;
          border-right: 1px solid #f3f4f6 !important;
        }
        .lms-grid .ag-header-cell:last-child  { border-right: 1px solid #f5f5ff !important; }
        .lms-grid .ag-header-cell-resize::after { display: none !important; }
        .lms-grid .ag-sort-indicator-icon { color: #3e2ecab8 !important; }
        .lms-grid .ag-header-icon { color: #d1d5db !important; }

        .lms-grid .ag-floating-filter {
          background: #ffffff !important; border-bottom: 1px solid #f3f4f6 !important;
          padding: 0 16px !important; min-height: 40px !important;
        }
        .lms-grid .ag-floating-filter-input {
          border: none !important; background: transparent !important;
          box-shadow: none !important;
        }
        .lms-grid .ag-text-field-input-wrapper { border: none !important; background: transparent !important; }
        .lms-grid .ag-floating-filter-button { color: #d1d5db !important; }

        .lms-grid .ag-row { border-bottom: none !important; transition: background 0.1s !important; }
        .lms-grid .ag-row-even  { background: #ffffff !important; }
        .lms-grid .ag-row-odd   { background: #f3f4fb !important; }
        .lms-grid .ag-row-hover { background: #e8eaf6 !important; }
        .lms-grid .ag-row { margin: 0 !important; }
        .lms-grid .ag-row::before, .lms-grid .ag-row::after { display: none !important; }
        .lms-grid .ag-cell { margin: 0 !important; }

        .lms-grid .ag-cell {
          justify-content: center !important; padding: 0 24px !important;
          font-size: 13px !important; color: #374151 !important;
          display: flex !important; align-items: center !important;
          border-right: 1px solid #f3f4f6 !important;
          border-bottom: 1px solid #f3f4f6 !important;
          line-height: 1.5 !important; word-break: break-word !important;
        }
        .lms-grid .ag-cell-value {
          overflow: visible !important; text-overflow: clip !important; text-wrap: auto !important;
        }
        .lms-grid.lms-grid-align-left   .ag-cell       { justify-content: flex-start !important; }
        .lms-grid.lms-grid-align-left   .ag-cell-value { text-align: left !important; }
        .lms-grid.lms-grid-align-center .ag-cell       { justify-content: center !important; }
        .lms-grid.lms-grid-align-center .ag-cell-value { text-align: center !important; }

        .lms-grid .ag-cell-focus, .lms-grid .ag-cell:focus {
          border: none !important; outline: none !important; box-shadow: none !important;
        }
        .lms-grid .ag-cell:last-child { border-right: none !important; }
        .lms-grid .ag-paging-panel   { display: none !important; }
        .lms-grid .ag-overlay-no-rows-wrapper { background: transparent !important; }
        .lms-grid .ag-body-viewport::-webkit-scrollbar { width: 4px; height: 4px; }
        .lms-grid .ag-body-viewport::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
        .lms-grid .ag-body-viewport::-webkit-scrollbar-track { background: transparent; }
        .lms-grid .ag-selection-checkbox { display: none !important; }

        .lms-pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; border-top: 1px solid #f3f4f6;
          background: #fff; gap: 8px; flex-wrap: wrap;
        }
        .lms-pagination-info { font-size: 11px; color: #9ca3af; white-space: nowrap; min-width: 0; }
        .lms-pagination-controls { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
        .lms-pagination-controls button {
          padding: 5px; border-radius: 8px; color: #9ca3af;
          background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          min-width: 30px; min-height: 30px; transition: background 0.15s, color 0.15s;
        }
        .lms-pagination-controls button:hover { background: #e0e7ff; color: #4f46e5; }
        .lms-pagination-page-label {
          font-size: 11px; font-weight: 600; color: #4b5563;
          padding: 0 6px; white-space: nowrap;
        }
        @media screen and (max-width: 400px) {
          .lms-pagination { justify-content: center; }
          .lms-pagination-info { width: 100%; text-align: center; }
        }
          .lms-grid .ag-header-cell-resize { pointer-events: none !important; cursor: default !important; }
      `}</style>

      <div
        className="lms-grid-root relative"
        style={{
          background: "#fefdfb", borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6", overflow: "hidden",
        }}
      >
        {/* ── Panel header (file 2) ── */}




        {/* ── Toolbar (file 2 search + export/filter buttons) ── */}

        {searchable && (
          <div
            style={{
              position: "relative",
              maxWidth: 350,
              flex: 1,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 16,
            }}
          >
            <svg style={{
              position: "absolute", left: 20, top: "50%",
              transform: "translateY(-50%)", width: 15, height: 15,
              color: "#9ca3af", pointerEvents: "none",
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              style={{
                width: "100%", paddingLeft: 32, paddingRight: 12,
                paddingTop: 7, paddingBottom: 7, fontSize: 13,
                border: "1px solid #e5e7eb", borderRadius: 10,
                background: "#ffffff", outline: "none",
                color: "#374151", boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 3px #fce7d7";
                e.target.style.borderColor = "#fbbf24";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.borderColor = "#e5e7eb";
              }}
            />
          </div>
        )}



        {/* ── Column toggle menu (file 1) ── */}
        {showColMenu && (
          <div style={{
            position: "absolute", right: 16, zIndex: 20, marginTop: 4,
            width: 208, background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 12,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#9ca3af", marginBottom: 8, paddingLeft: 4,
            }}>
              Toggle Columns
            </p>
            {normalizedColumns.map((col) => (
              <label key={col.__colId} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 4px", fontSize: 13, color: "#374151",
                borderRadius: 8, cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={visibleCols.has(col.__colId)}
                  onChange={() => toggleColumn(col.__colId)}
                  style={{ accentColor: "#6a696b" }}
                />
                {col.__headerName}
              </label>
            ))}
          </div>
        )}

        {/* ── Grid scroll wrapper (file 1) ── */}
        <div className="lms-grid-scroll">
          <div
            className={`lms-grid ${alignClass}`}
            style={{ border: "3px solid #1d31715b", borderRadius: "0 0 16px 16px" }}
          >
            <AgGridReact
              ref={gridRef}
              theme={purpleTheme}
              domLayout="autoHeight"
              rowData={rows}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              getRowId={getRowId}
              animateRows
              rowSelection="multiple"
              suppressRowClickSelection
              pagination
              paginationPageSize={pageSizeState}
              suppressPaginationPanel
              onGridReady={onGridReady}
              onFirstDataRendered={onFirstDataRendered}
              onFilterChanged={onFilterChanged}
              onPaginationChanged={onPaginationChanged}
              onModelUpdated={onModelUpdated}
              onGridSizeChanged={onGridSizeChanged}
              overlayNoRowsTemplate={`
                <div style="display:flex;flex-direction:column;align-items:center;gap:8px;color:#9ca3af;padding:40px 0">
                  <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
                  </svg>
                  <span style="font-size:13px;font-weight:600;color:#6b7280">${emptyMessage}</span>
                </div>
              `}
            />

            {/* ── Custom pagination (file 1) ── */}
            <div className="lms-pagination">
              <span className="lms-pagination-info">{rowRangeLabel}</span>
              <div className="lms-pagination-controls">
                <button onClick={() => gridRef.current?.api?.paginationGoToFirstPage()} >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
                  </svg>
                </button>
                <button onClick={() => gridRef.current?.api?.paginationGoToPreviousPage()} >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="lms-pagination-page-label">{pageLabel}</span>
                <button onClick={() => gridRef.current?.api?.paginationGoToNextPage()} >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button onClick={() => gridRef.current?.api?.paginationGoToLastPage()} >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
