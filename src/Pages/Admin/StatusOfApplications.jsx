import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, getLatestPublication, generateApprovalMails } from "../../api";
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
const getColumns = (onDebarClick, onDeleteClick) => [
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
  // CURRENT QTR TYPE
  { key: "currentQtyType", header: "CURRENT QTR TYPE", minWidth: 180 },
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
  // REQUEST QUARTER TYPE
  { key: "reqQtrType", header: "REQUEST QTR TYPE", minWidth: 200 },
  // REQUEST QUARTER LOCATION (Area Type)
  { key: "reqQtrLocation", header: "REQUEST QTR LOCATION", minWidth: 220 },
  // REQUEST QUARTER NUMBER
  { key: "reqQtr", header: "REQUEST QTR NO", minWidth: 145 },

  // EXCHANGE

  { key: "exchangeReason", header: "EXCHANGE", minWidth: 140, render: (val) => val || "—" },

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
      const resultLower = (row.result || "").toLowerCase();
      if (resultLower === "approved" || resultLower === "allotted") {
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
  // DELETE
  {
    key: "delete",
    header: "DELETE",
    minWidth: 140,
    render: (_, row) => (
      <button
        onClick={() => onDeleteClick(row)}
        className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    ),
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
        "CURRENT QTR TYPE",
        "CURRENT QTR",
        "REQUEST TYPE",
        "REQUEST LOCATION",
        "REQUEST QTR NO",
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
          row.currentQtyType ? String(row.currentQtyType).trim() : "-",
          currentQtr,
          row.reqQtrType ? String(row.reqQtrType).trim() : "-",
          row.reqQtrLocation ? String(row.reqQtrLocation).trim() : "-",
          row.reqQtr ? String(row.reqQtr).trim() : "-",
          row.exchangeReason ? String(row.exchangeReason).trim() : "-",
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
          7: { halign: "center" }, // CURRENT QTR TYPE
          8: { halign: "center" }, // CURRENT QTR
          9: { halign: "center" }, // REQUEST TYPE
          10: { halign: "center" }, // REQUEST LOCATION
          11: { halign: "center" }, // REQUEST QTR NO
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

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mail Modal State
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [isMailing, setIsMailing] = useState(false);

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

  const handleDeleteClick = (row) => {
    setSelectedUserToDelete(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserToDelete) return;
    setIsDeleting(true);
    try {
      await request(`/api/admin/applications/${selectedUserToDelete.id}`, {
        method: "DELETE",
        auth: true,
      });
      setDeleteModalOpen(false);
      setSelectedUserToDelete(null);
      fetchApplications();
    } catch (err) {
      alert(err?.message || "Failed to delete application.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateMailConfirm = async () => {
    setIsMailing(true);
    try {
      const res = await generateApprovalMails();
      alert(res.message || "Mail generation started.");
      setMailModalOpen(false);
      fetchApplications();
    } catch (err) {
      alert(err?.message || "Failed to generate mails.");
    } finally {
      setIsMailing(false);
    }
  };

  const columns = getColumns(handleDebarClick, handleDeleteClick);

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
        <div className="flex items-center gap-4">
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
          <button
            onClick={() => setMailModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Generate Mail
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedUserToDelete && (
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
              maxWidth: "460px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px 14px",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Delete Application
                </p>
              </div>
              <button
                onClick={() => { setDeleteModalOpen(false); setSelectedUserToDelete(null); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", fontSize: "20px", lineHeight: 1, padding: "2px 6px",
                }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{
                padding: "14px 16px", borderRadius: "10px",
                background: "#fef2f2", border: "1px solid #fecdd3",
                marginBottom: "18px",
              }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#991b1b", lineHeight: 1.5 }}>
                  Are you sure you want to delete this application? This action cannot be undone.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                <DetailRow label="Emp ID" value={selectedUserToDelete.empId} />
                <DetailRow label="Emp Name" value={selectedUserToDelete.empName} />
                <DetailRow label="App No" value={selectedUserToDelete.appNo} />
                <DetailRow label="Status" value={selectedUserToDelete.result} />
                <DetailRow label="Requested Qtr" value={selectedUserToDelete.reqQtr} />
                <DetailRow label="Qtr Type" value={selectedUserToDelete.reqQtrType} />
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: "flex", justifyContent: "flex-end", gap: "10px",
              padding: "14px 24px 18px",
              borderTop: "1px solid #f1f5f9",
            }}>
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setSelectedUserToDelete(null); }}
                disabled={isDeleting}
                style={{
                  padding: "8px 18px", borderRadius: "8px",
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#475569", fontSize: "13px", fontWeight: 600,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                style={{
                  padding: "8px 20px", borderRadius: "8px",
                  border: "none", background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.6 : 1,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Mail Confirmation Modal */}
      {mailModalOpen && (
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
              maxWidth: "460px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px 14px",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Generate Approval Mails
                </p>
              </div>
              <button
                onClick={() => setMailModalOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", fontSize: "20px", lineHeight: 1, padding: "2px 6px",
                }}
              >✕</button>
            </div>

            <div style={{ padding: "24px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                Are you sure you want to lock in the allotted winners, mark them as <strong>Approved</strong>, and email them their allotment order PDFs?
              </p>
              <p style={{ margin: "12px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                This process runs in the background and may take a few minutes if there are many winners.
              </p>
            </div>

            <div style={{
              display: "flex", justifyContent: "flex-end", gap: "10px",
              padding: "14px 24px 18px",
              borderTop: "1px solid #f1f5f9",
            }}>
              <button
                type="button"
                onClick={() => setMailModalOpen(false)}
                disabled={isMailing}
                style={{
                  padding: "8px 18px", borderRadius: "8px",
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#475569", fontSize: "13px", fontWeight: 600,
                  cursor: isMailing ? "not-allowed" : "pointer",
                }}
              >Cancel</button>
              <button
                type="button"
                onClick={handleGenerateMailConfirm}
                disabled={isMailing}
                style={{
                  padding: "8px 20px", borderRadius: "8px",
                  border: "none", background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  cursor: isMailing ? "not-allowed" : "pointer",
                  opacity: isMailing ? 0.6 : 1,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                }}
              >

                {isMailing ? "Generating..." : "Generate & Send Mails"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}












