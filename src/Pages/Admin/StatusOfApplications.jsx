import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, getLatestPublication } from "../../api";
import Logo from "../../assets/Logo.png";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100   text-rose-700",
  pending: "bg-amber-100  text-amber-700",
};


function toDateKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// const columns = [
//   { key: "priorityNo", header: "PRIORITY NO",    minWidth: 120 },
//   { key: "appNo",      header: "APP NO",         minWidth: 130 },
//   { key: "empId",      header: "EMP ID",         renderer: "empId", minWidth: 135 },
//   { key: "empName",    header: "EMP NAME",       minWidth: 220 },
//   { key: "class",      header: "CLASS",          renderer: "class", minWidth: 155 },
//   { key: "gradDate",   header: "GRAD DATE",      minWidth: 135 },
//   { key: "dob",        header: "DATE OF BIRTH",     minWidth: 120 },
//   { key: "casteId",    header: "CASTE ID",       minWidth: 120 },
//   { key: "currentQtyType",       header: "CURRENT QTR TYPE",     minWidth: 180 },
//   { key: "reqQtr",     header: "REQUESTED QTR",  minWidth: 145 },
//   { key: "reqQtrLocation", header: "REQUESTED QTR LOCATION", minWidth: 220 },
//   { key: "reqQtrType", header: "REQUESTED QTR TYPE", minWidth: 180 },
//   { key: "exchange",   header: "EXCHANGE",       minWidth: 140 },
const getColumns = (onDebarClick) => [
  // EMP ID
  { key: "empId", header: "EMP ID", renderer: "empId", minWidth: 135 },
  // EMP NAME
  { key: "empName", header: "EMP NAME", minWidth: 220 },
  // CLASS
  { key: "class", header: "CLASS", renderer: "class", minWidth: 155 },
  // GRAD DATE
  { key: "gradDate", header: "GRAD DATE", minWidth: 135 },
  // DEPARTMENT
  { key: "dept", header: "DEPARTMENT", minWidth: 150 },
  // CASTE ID
  { key: "casteId", header: "CASTE ID", minWidth: 120 },
  // CURRENT QTR — combined area_type / quarter_no
  {
    key: "currentQtr",
    header: "CURRENT QTR",
    minWidth: 160,
    render: (_, row) =>
      row?.currentAreaType && row?.currentQuarterNo
        ? `${String(row.currentAreaType).trim()}/${String(row.currentQuarterNo).trim()}`
        : "—",
  },
  // CURRENT QTR TYPE
  { key: "currentQtyType", header: "CURRENT QTR TYPE", minWidth: 180 },
  // REQUEST QUARTER NUMBER
  { key: "reqQtr", header: "REQUEST QTR NO", minWidth: 145 },
  // REQUEST QUARTER LOCATION (Area Type)
  { key: "reqQtrLocation", header: "REQUEST QTR LOCATION", minWidth: 220 },
  // REQUEST QUARTER TYPE
  { key: "reqQtrType", header: "REQUEST QTR TYPE", minWidth: 200 },
  // EXCHANGE
  { key: "exchange", header: "EXCHANGE", minWidth: 140, render: (val) => val || "—" },
  // ROSTER NO
  { key: "rosterNo", header: "ROSTER NO", minWidth: 140 },
  // STATUS
  {
    key: "result",
    header: "STATUS",
    minWidth: 150,
    render: (value) => {
      const normalized = (value || "").toLowerCase();
      const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[normalized] || "bg-slate-100 text-slate-600"
            }`}
        >
          {label}
        </span>
      );
    },
  },
  // DEBARRED
  {
    key: "debarred",
    header: "DEBARRED",
    minWidth: 130,
    render: (_, row) => {
      if ((row.result || "").toLowerCase() === "approved") {
        return (
          <button
            onClick={() => onDebarClick(row)}
            className="inline-flex rounded-md bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 hover:bg-rose-200 transition-colors"
          >
            Action
          </button>
        );
      }
      return <span className="text-slate-400 text-xs font-semibold">—</span>;
    },
  },
];

/* ─── Detail row inside modal ────────────────────────────────── */
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-[13px] font-semibold text-slate-800 break-all">{value || "—"}</span>
    </div>
  );
}



/* ── Option 2: Title row with inline metric badges ── */
function PageSummaryBar({ rows }) {

  const approvedCount = rows.filter((d) => (d.result || "").toLowerCase() === "approved").length;

  const downloadPDF = () => {
    if (rows.length === 0) {
      alert("No applications to download.");
      return;
    }

    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

    const generatePDF = () => {
      // Top Header (Left-aligned)
      doc.setFontSize(22);
      doc.setFont(undefined, "bold");
      doc.setTextColor(24, 95, 165); // Theme Color
      doc.text("PARADIP PORT AUTHORITY", 14, 22);

      doc.setFontSize(14);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100);
      doc.text("Land Data Management System", 14, 30);

      // Separator Line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(14, 36, pageWidth - 14, 36);

    
      // Sub Header
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.setFont(undefined, "bold");
      doc.text("Quarter Applications Status List", 14, 46);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.setTextColor(150);
      doc.text(`Generated on: ${dateStr}`, 14, 52);

      const tableColumn = [
        "S.NO",
        "EMP ID",
        "EMP NAME",
        "CLASS",
        "GRAD DATE",
        "DEPARTMENT",
        "CASTE ID",
        "CURRENT QTR",
        "CURRENT QTR TYPE",
        "REQUEST QTR NO",
        "REQUEST LOCATION",
        "REQUEST TYPE",
        "EXCHANGE",
        "ROSTER NO",
        "STATUS"
      ];

      const tableRows = rows.map((row, index) => {
        const statusLabel = row.result ? String(row.result).trim().charAt(0).toUpperCase() + String(row.result).trim().slice(1).toLowerCase() : "-";
        const currentQtr = row.currentAreaType && row.currentQuarterNo
          ? `${String(row.currentAreaType).trim()}/${String(row.currentQuarterNo).trim()}`
          : "-";
        const gradStr = row.gradDate ? toDateKey(row.gradDate) : "-";

        return [
          index + 1,
          row.empId ? String(row.empId).trim() : "-",
          row.empName ? String(row.empName).trim() : "-",
          row.class ? String(row.class).trim() : "-",
          gradStr,
          row.dept ? String(row.dept).trim() : "-",
          row.casteId ? String(row.casteId).trim() : "-",
          currentQtr,
          row.currentQtyType ? String(row.currentQtyType).trim() : "-",
          row.reqQtr ? String(row.reqQtr).trim() : "-",
          row.reqQtrLocation ? String(row.reqQtrLocation).trim() : "-",
          row.reqQtrType ? String(row.reqQtrType).trim() : "-",
          row.exchange ? String(row.exchange).trim() : "-",
          row.rosterNo ? String(row.rosterNo).trim() : "-",
          statusLabel
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 58,
        theme: "grid",
        margin: { left: 8, right: 8 },
        styles: {
          fontSize: 7,
          cellPadding: 3,
          minCellHeight: 12,
          valign: "middle",
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
          textColor: [40, 40, 40],
          overflow: "linebreak"
        },
        headStyles: {
          fillColor: [24, 95, 165],
          textColor: 255,
          fontStyle: "bold"
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { halign: "center" }, // S.NO
          1: { halign: "center" }, // EMP ID
          2: { halign: "left" },   // EMP NAME
          3: { halign: "center" }, // CLASS
          4: { halign: "center" }, // GRAD DATE
          5: { halign: "left" },   // DEPARTMENT
          6: { halign: "center" }, // CASTE ID
          7: { halign: "center" }, // CURRENT QTR
          8: { halign: "center" }, // CURRENT QTR TYPE
          9: { halign: "center" }, // REQUEST QTR NO
          10: { halign: "center" }, // REQUEST LOCATION
          11: { halign: "center" }, // REQUEST TYPE
          12: { halign: "center" }, // EXCHANGE
          13: { halign: "center" }, // ROSTER NO
          14: { halign: "center" }  // STATUS
        }
      });

      doc.save(`Quarter_Applications_Status_${dateStr.replace(/ /g, "_")}.pdf`);
    };

    const img = new Image();
    img.src = Logo;
    img.onload = () => {
      // Draw logo on the right side
      doc.addImage(img, "PNG", pageWidth - 38, 10, 24, 24);
      generatePDF();
    };
    img.onerror = () => {
      generatePDF();
    };
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 text-sm font-semibold text-slate-700 min-w-[160px]">
        Status of Applications
      </span>
      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 rounded-lg bg-[#185FA5] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f477f] shadow-sm cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Applications List (PDF)
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {approvedCount} Approved
        </span>

      </div>
    </div>
  );
}


export default function StatusOfApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("current");
  const [currentPublication, setCurrentPublication] = useState(null);

  // Debar Modal State
  const [debarModalOpen, setDebarModalOpen] = useState(false);
  const [selectedUserToDebar, setSelectedUserToDebar] = useState(null);
  const [debarFromDate, setDebarFromDate] = useState("");
  const [debarToDate, setDebarToDate] = useState("");
  const [isDebarring, setIsDebarring] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    request("/api/admin/status-of-applications", { auth: true })
      .then((data) => {
        setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        setError(fetchError?.message || "Failed to load application statuses.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let isActive = true;
    getLatestPublication()
      .then((data) => {
        if (isActive) setCurrentPublication(data || null);
      })
      .catch(() => {
        if (isActive) setCurrentPublication(null);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const handleDebarClick = (row) => {
    setSelectedUserToDebar(row);
    setDebarFromDate("");
    setDebarToDate("");
    setDebarModalOpen(true);
  };

  const handleDebarSubmit = async (e) => {
    e.preventDefault();
    if (!debarFromDate || !debarToDate) {
      alert("Please select both from and to dates.");
      return;
    }

    if (new Date(debarFromDate) > new Date(debarToDate)) {
      alert("To Date must be after From Date.");
      return;
    }

    setIsDebarring(true);
    try {
      await request("/api/admin/debar-user", {
        method: "POST",
        body: {
          userId: selectedUserToDebar.userId,
          fromDate: debarFromDate,
          toDate: debarToDate,
        },
        auth: true,
      });
      alert(`Successfully debarred ${selectedUserToDebar.empName}`);
      setDebarModalOpen(false);
      fetchApplications();
    } catch (err) {
      alert(err.message || "Failed to debar user.");
    } finally {
      setIsDebarring(false);
    }
  };

  const columns = getColumns(handleDebarClick);

  const currentWindowKey = {
    from: toDateKey(currentPublication?.From_Date),
    to: toDateKey(currentPublication?.To_Date),
  };

  const isPublicationActive = currentPublication?.Current_State === "Published";

  const currentApplicationRows = isPublicationActive
    ? rows.filter((row) => {
        if (!currentWindowKey.from || !currentWindowKey.to) return true;
        return (
          toDateKey(row?.publishedDateFrom) === currentWindowKey.from &&
          toDateKey(row?.publishedDateTo) === currentWindowKey.to
        );
      })
    : [];

  const historyApplicationRows = isPublicationActive
    ? rows.filter((row) => {
        if (!currentWindowKey.from || !currentWindowKey.to) return true;
        return !(
          toDateKey(row?.publishedDateFrom) === currentWindowKey.from &&
          toDateKey(row?.publishedDateTo) === currentWindowKey.to
        );
      })
    : rows;

  const visibleRows = viewMode === "history" ? historyApplicationRows : currentApplicationRows;

  return (
    <AdminLayout
      title="Status of Applications"
      subtitle="Land Data Management System - Application Tracker"
      headerRight={
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("current")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "current"
                ? "bg-[#1b2d69] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            Current Applications
          </button>
          <button
            type="button"
            onClick={() => setViewMode("history")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "history"
                ? "bg-[#1b2d69] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            History of Applications
          </button>
        </div>
      }
    >
      <div className="lms-data-transition space-y-6">
        <PageSummaryBar rows={visibleRows} />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="w-full overflow-x-auto rounded-xl">
          <AgGridTable
            columns={columns}
            rows={visibleRows}
            searchable
            pageSize={8}
            showExport
            showFilter
            emptyMessage={loading ? "Loading application statuses..." : "No application statuses found."}
          />
        </div>
      </div>

      {/* Debar Modal */}
      {debarModalOpen && selectedUserToDebar && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.55)",
            backdropFilter: "blur(3px)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px 14px",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Debar User
                </p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0", fontWeight: 500 }}>
                  {selectedUserToDebar.appNo}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                  APPROVED
                </span>
                <button
                  onClick={() => setDebarModalOpen(false)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", fontSize: "20px", lineHeight: 1, padding: "2px 6px",
                  }}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px", flex: 1 }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Employee Details
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 20px", marginBottom: "20px" }}>
                <DetailRow label="Emp ID" value={selectedUserToDebar.empId} />
                <DetailRow label="Emp Name" value={selectedUserToDebar.empName} />
                <DetailRow label="Email" value={selectedUserToDebar.emailId || "N/A"} />
                <DetailRow label="Class" value={selectedUserToDebar.class} />
                <DetailRow label="Basic Pay" value={selectedUserToDebar.basic} />
                <DetailRow label="Caste" value={selectedUserToDebar.casteId} />
                <DetailRow label="Date of Joining" value={selectedUserToDebar.dateOfJoin} />
                <DetailRow label="Grad Date" value={selectedUserToDebar.gradDate} />
                <DetailRow label="Req Date" value={selectedUserToDebar.reqDate} />
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0 16px" }} />

              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Quarter Requested
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 20px", marginBottom: "20px" }}>
                <DetailRow label="Quarter No" value={selectedUserToDebar.reqQtr} />
                <DetailRow label="Quarter Type" value={selectedUserToDebar.reqQtrType} />
                <DetailRow label="Location" value={selectedUserToDebar.reqQtrLocation} />
                <DetailRow label="Reason" value={selectedUserToDebar.reason || "N/A"} />
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0 16px" }} />

              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Debarment Period
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    From Date
                  </label>
                  <input
                    type="date"
                    required
                    value={debarFromDate}
                    onChange={(e) => setDebarFromDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    To Date
                  </label>
                  <input
                    type="date"
                    required
                    value={debarToDate}
                    onChange={(e) => setDebarToDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 24px 18px",
              borderTop: "1px solid #f1f5f9",
            }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                This user is currently <strong>approved</strong>.
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setDebarModalOpen(false)}
                  disabled={isDebarring}
                  style={{
                    padding: "8px 18px", borderRadius: "8px",
                    border: "1.5px solid #e2e8f0", background: "#fff",
                    color: "#475569", fontSize: "13px", fontWeight: 600,
                    cursor: isDebarring ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDebarSubmit}
                  disabled={isDebarring}
                  style={{
                    padding: "8px 20px", borderRadius: "8px",
                    border: "none", background: "linear-gradient(135deg, #e11d48, #be123c)",
                    color: "#fff", fontSize: "13px", fontWeight: 700,
                    cursor: isDebarring ? "not-allowed" : "pointer",
                    opacity: isDebarring ? 0.6 : 1,
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    boxShadow: "0 2px 8px rgba(225,29,72,0.3)",
                  }}
                >
                  {isDebarring ? "Saving..." : "Debar User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}



