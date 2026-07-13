import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, API_BASE, getLatestPublication } from "../../api";
import Logo from "../../assets/Logo.png";

function toDateKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


/* ─── Status badge styles ─────────────────────────────────────── */
const statusStyles = {
  pending: "bg-amber-100  text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100   text-rose-700",
  cancelled: "bg-slate-100  text-slate-600",
};
function StatusBadge({ value }) {
  if (!value) return <span className="text-slate-400">—</span>;
  const label = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[value.toLowerCase()] || "bg-slate-100 text-slate-600"
        }`}
    >
      {label}
    </span>
  );
}

/* ─── Column definitions ──────────────────────────────────────── */
const makeColumns = (onReview) => [
  { key: "Id", header: "SNO", minWidth: 100 },
  { key: "EmpId", header: "EmpID", minWidth: 130 },
  { key: "EmpName", header: "Emp_Name", minWidth: 200 },
  { key: "Class", header: "CLASS", minWidth: 140 },
  { key: "GradDate", header: "GRAD_Date", minWidth: 140 },
  { key: "DateOfJoining", header: "Date_of_Join", minWidth: 155 },
  { key: "Basic", header: "Basic", renderer: "basic", minWidth: 110 },
  { key: "DateOfBirth", header: "DATA_OF_BIRTH", minWidth: 150 },
  { key: "Department", header: "DEPT", minWidth: 150 },
  { key: "Caste", header: "CASTE_ID", minWidth: 120 },
  {
    key: "CurrentQtr",
    header: "CURRENT QTR",
    minWidth: 150,
    render: (_, row) =>
      row?.CurrentAreaType && row?.CurrentQuarterNo
        ? `${String(row.CurrentAreaType).trim()}/${String(row.CurrentQuarterNo).trim()}`
        : "—",
  },
  { key: "CurrentQuarterType", header: "CURRENT QTY_Type", minWidth: 180 },
  { key: "QtrRequested", header: "REQ_QTR", minWidth: 120 },
  { key: "QtrLocation", header: "REQ_QTR_Location", minWidth: 160 },
  { key: "QtrType", header: "REQ_QTR_Type", minWidth: 180 },
  { key: "ExchangeReason", header: "Exchange", minWidth: 140, render: (val) => val || "—" },
  {
    key: "AttachmentPath",
    header: "Proof File",
    minWidth: 150,
    render: (value) => {
      if (!value) return <span className="text-slate-400">—</span>;
      const normalised = value.replace(/\\/g, "/").replace(/^.*uploads\//, "");
      const fileUrl = `${API_BASE}/uploads/${normalised}`;
      const fileName = normalised.split("/").pop();
      const handleDownload = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error("Not found");
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(objectUrl);
        } catch {
          alert("Could not download the file.");
        }
      };
      return (
        <button
          type="button"
          onClick={handleDownload}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            textDecoration: "underline",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
        >
          Download
        </button>
      );
    }
  },
  { key: "ReqDate", header: "REQ_Date", minWidth: 160 },
  {
    key: "TentativeStatus",
    header: "Allotment Status",
    minWidth: 160,
    render: (val, row) => (
      <div className="flex flex-col gap-1 items-start">
        {row.TentativeStatus === "Winner" ? (
          <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
            Tentative Winner
          </span>
        ) : (
          <StatusBadge value={row.Status} />
        )}
        {row.RosterNo && (
          <span className="text-[10px] font-bold text-blue-600">Roster Pt: {row.RosterNo}</span>
        )}
      </div>
    )
  }
];

/* ─── Summary bar ─────────────────────────────────────────────── */
function PageSummaryBar({ rows }) {
  const total = rows.length;
  const pending = rows.filter((r) => r.Status?.toLowerCase() === "pending").length;
  const approved = rows.filter((r) => r.Status?.toLowerCase() === "approved").length;
  const rejected = rows.filter((r) => r.Status?.toLowerCase() === "rejected").length;

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
      doc.text("Quarter Applications Verification List", 14, 46);

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
        "DATE OF JOINING",
        "BASIC",
        "DATE OF BIRTH",
        "DEPARTMENT",
        "CASTE",
        "CURRENT QTR",
        "CURRENT TYPE",
        "REQ QTR",
        "REQ LOCATION",
        "REQ TYPE",
        "EXCHANGE",
        "REQ DATE"
      ];

      const tableRows = rows.map((row, index) => {
        const dobStr = row.DateOfBirth ? toDateKey(row.DateOfBirth) : "-";
        const dojStr = row.DateOfJoining ? toDateKey(row.DateOfJoining) : "-";
        const gradStr = row.GradDate ? toDateKey(row.GradDate) : "-";
        const reqDateStr = row.ReqDate ? String(row.ReqDate).trim() : "-";
        
        const currentQtr = row.CurrentAreaType && row.CurrentQuarterNo
          ? `${String(row.CurrentAreaType).trim()}/${String(row.CurrentQuarterNo).trim()}`
          : "-";
        
        return [
          index + 1,
          row.EmpId ? String(row.EmpId).trim() : "-",
          row.EmpName ? String(row.EmpName).trim() : "-",
          row.Class ? String(row.Class).trim() : "-",
          gradStr,
          dojStr,
          row.Basic !== undefined && row.Basic !== null ? String(row.Basic).trim() : "-",
          dobStr,
          row.Department ? String(row.Department).trim() : "-",
          row.Caste ? String(row.Caste).trim() : "-",
          currentQtr,
          row.CurrentQuarterType ? String(row.CurrentQuarterType).trim() : "-",
          row.QtrRequested ? String(row.QtrRequested).trim() : "-",
          row.QtrLocation ? String(row.QtrLocation).trim() : "-",
          row.QtrType ? String(row.QtrType).trim() : "-",
          row.ExchangeReason ? String(row.ExchangeReason).trim() : "-",
          reqDateStr
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 58,
        theme: "grid",
        margin: { left: 8, right: 8 },
        styles: {
          fontSize: 6,
          cellPadding: 1.5,
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
          5: { halign: "center" }, // DATE OF JOINING
          6: { halign: "center" }, // BASIC
          7: { halign: "center" }, // DATE OF BIRTH
          8: { halign: "left" },   // DEPARTMENT
          9: { halign: "center" }, // CASTE
          10: { halign: "center" }, // CURRENT QTR
          11: { halign: "center" }, // CURRENT TYPE
          12: { halign: "center" }, // REQ QTR
          13: { halign: "center" }, // REQ LOCATION
          14: { halign: "center" }, // REQ TYPE
          15: { halign: "center" }, // EXCHANGE
          16: { halign: "center" }  // REQ DATE
        }
      });

      doc.save(`Quarter_Applications_Verification_${dateStr.replace(/ /g, "_")}.pdf`);
    };

    const img = new Image();
    img.src = Logo;
    img.onload = () => {
      doc.addImage(img, "PNG", pageWidth - 38, 10, 24, 24);
      generatePDF();
    };
    img.onerror = () => {
      generatePDF();
    };
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 min-w-[160px] text-sm font-semibold text-slate-700">
        Verify Quarter Applications
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



        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {total} Total
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {pending} Pending
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {approved} Approved
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          {rejected} Rejected
        </span>
      </div>
    </div>
  );
}

/* ─── Detail row inside modal ────────────────────────────────── */
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-[13px] font-semibold text-slate-800 break-all">{value || "—"}</span>
    </div>
  );
}

/* ─── Attachment download button ─────────────────────────────── */
function AttachmentButton({ path }) {
  if (!path) return <span className="text-slate-400 text-xs">No attachment</span>;

  const normalised = path.replace(/\\/g, "/").replace(/^.*uploads\//, "");
  const fileUrl = `${API_BASE}/uploads/${normalised}`;
  const fileName = normalised.split("/").pop();

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Not found");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert("Could not download the file.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 12px",
        borderRadius: "7px",
        background: "#E6F1FB",
        color: "#185FA5",
        fontWeight: 700,
        fontSize: "12px",
        border: "1px solid #b3d0ef",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#c7dff5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#E6F1FB")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download Attachment
    </button>
  );
}

/* ─── Review Modal ───────────────────────────────────────────── */
function ReviewModal({ app, onClose, onAction }) {
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const overlayRef = useRef(null);

  // Close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const submit = async (newStatus) => {
    setSubmitting(true);
    setActionError("");
    try {
      await request(`/api/admin/applications/${app.Id}`, {
        method: "PATCH",
        body: { status: newStatus },
        auth: true,
      });
      onAction(app.Id, newStatus);
      onClose();
    } catch (err) {
      setActionError(err?.message || "Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = app.Status?.toLowerCase() === "pending";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
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
              Review Application
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0", fontWeight: 500 }}>
              {app.AppNo}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StatusBadge value={app.Status} />
            <button
              onClick={onClose}
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

          {/* Employee details grid */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Employee Details
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 20px", marginBottom: "20px" }}>
            <DetailRow label="Emp ID" value={app.EmpId} />
            <DetailRow label="Emp Name" value={app.EmpName} />
            <DetailRow label="Department" value={app.Department} />
            <DetailRow label="Email" value={app.EmailId} />
            <DetailRow label="Class" value={app.Class} />
            <DetailRow label="Basic Pay" value={app.Basic} />
            <DetailRow label="Caste" value={app.Caste} />
            <DetailRow label="Date of Joining" value={app.DateOfJoining} />
            <DetailRow label="Grad Date" value={app.GradDate} />
            <DetailRow label="Current Quarter Type" value={app.CurrentQuarterType} />
            <DetailRow label="Current Area Type" value={app.CurrentAreaType} />
            <DetailRow label="Current Quarter No" value={app.CurrentQuarterNo} />
            <DetailRow label="Req Date" value={app.ReqDate} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0 16px" }} />

          {/* Quarter details */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Quarter Requested
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 20px", marginBottom: "20px" }}>
            <DetailRow label="Quarter No" value={app.QtrRequested} />
            <DetailRow label="Quarter Type" value={app.QtrType} />
            <DetailRow label="Location" value={app.QtrLocation} />
            <DetailRow label="Reason" value={app.Reason} />
            {app.ExchangeReason && (
              <div style={{ gridColumn: "1 / -1" }}>
                <DetailRow label="Exchange Reason" value={app.ExchangeReason} />
              </div>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0 16px" }} />

          {/* Attachment */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            Attachment
          </p>
          <div style={{ marginBottom: "20px" }}>
            <AttachmentButton path={app.AttachmentPath} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "4px 0 16px" }} />

          {/* Error */}
          {actionError && (
            <div style={{
              marginTop: "10px",
              background: "#fff1f2", border: "1px solid #fecdd3",
              borderRadius: "8px", padding: "8px 12px",
              color: "#be123c", fontSize: "12px", fontWeight: 600,
            }}>
              {actionError}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: "10px",
          padding: "14px 24px 18px",
          borderTop: "1px solid #f1f5f9",
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "8px 18px", borderRadius: "8px",
              border: "1.5px solid #e2e8f0", background: "#fff",
              color: "#475569", fontSize: "13px", fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function VerifyQuarterApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // row being reviewed
  const [viewMode, setViewMode] = useState("current");
  const [currentPublication, setCurrentPublication] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([
      request("/api/admin/verify-quarter-applications", { auth: true }),
      request("/api/admin/dynamic-allotments", { auth: true }).catch(() => ({ winners: [], losers: [] }))
    ])
      .then(([appData, dynamicData]) => {
        const apps = Array.isArray(appData?.items) ? appData.items : [];
        const winners = dynamicData?.winners || [];
        const updatedApps = apps.map(app => {
          const isWinner = winners.find(w => w.Id === app.Id);
          if (isWinner) {
            return { ...app, RosterNo: isWinner.RosterNo, TentativeStatus: "Winner" };
          }
          return app;
        });
        setRows(updatedApps);
      })
      .catch((err) => setError(err?.message || "Failed to load applications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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

  // After approve/reject: update the row in-place instantly
  const handleAction = (id, newStatus, notes) => {
    setRows((prev) =>
      prev.map((r) =>
        r.Id === id ? { ...r, Status: newStatus, Notes: notes } : r
      )
    );
  };

  const columns = makeColumns((row) => setSelected(row));

  const currentWindowKey = {
    from: toDateKey(currentPublication?.From_Date),
    to: toDateKey(currentPublication?.To_Date),
  };

  const isPublicationActive = currentPublication?.Current_State === "Published";

  const currentApplicationRows = isPublicationActive
    ? rows.filter((row) => {
      if (!currentWindowKey.from || !currentWindowKey.to) return true;
      return (
        toDateKey(row?.PublishedDateFrom) === currentWindowKey.from &&
        toDateKey(row?.PublishedDateTo) === currentWindowKey.to
      );
    })
    : [];

  const historyApplicationRows = isPublicationActive
    ? rows.filter((row) => {
      if (!currentWindowKey.from || !currentWindowKey.to) return true;
      return !(
        toDateKey(row?.PublishedDateFrom) === currentWindowKey.from &&
        toDateKey(row?.PublishedDateTo) === currentWindowKey.to
      );
    })
    : rows;

  const visibleRows = viewMode === "history" ? historyApplicationRows : currentApplicationRows;

  return (
    <AdminLayout
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Staff Review"
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
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={load}
              className="ml-4 rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
            >
              Retry
            </button>
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
            searchPlaceholder="Search employee, quarter, status…"
            emptyMessage={loading ? "Loading applications…" : "No applications found."}
          />
        </div>
      </div>

      {/* Review modal */}
      {selected && (
        <ReviewModal
          app={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </AdminLayout>
  );
}
