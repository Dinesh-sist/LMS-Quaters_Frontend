import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, API_BASE } from "../../api";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100   text-rose-700",
  pending: "bg-amber-100  text-amber-700",
};

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
  { key: "priorityNo", header: "PRIORITY NO", minWidth: 120 },
  { key: "appNo", header: "APP NO", minWidth: 130 },
  { key: "empId", header: "EMP ID", renderer: "empId", minWidth: 135 },
  { key: "empName", header: "EMP NAME", minWidth: 220 },
  { key: "class", header: "CLASS", renderer: "class", minWidth: 155 },
  { key: "basic", header: "BASIC", renderer: "basic", minWidth: 110 },
  { key: "gradDate", header: "GRAD DATE", minWidth: 135 },
  { key: "dob", header: "DATE OF BIRTH", minWidth: 180 },
  { key: "casteId", header: "CASTE ID", minWidth: 120 },
  { key: "currentQtyType", header: "CURRENT QTR TYPE", minWidth: 180 },
  { key: "reqQtr", header: "REQUESTED QTR", minWidth: 145 },
  { key: "reqQtrLocation", header: "REQUESTED QTR LOCATION", minWidth: 240 },
  { key: "reqQtrType", header: "REQUESTED QTR TYPE", minWidth: 280 },
  { key: "exchange", header: "EXCHANGE", minWidth: 140 },
  {
    key: "proofFile",
    header: "PROOF FILE",
    minWidth: 160,
    render: (value) => {
      if (!value) return <span className="text-slate-400 text-xs">—</span>;

      const normalised = value.replace(/\\/g, "/").replace(/^.*uploads\//, "");
      const fileUrl = `${API_BASE}/uploads/${normalised}`;
      const fileName = normalised.split("/").pop();

      const handleDownload = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error("File not found");
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(objectUrl);
        } catch {
          alert("Could not download the file. Please try again.");
        }
      };

      return (
        <button
          type="button"
          onClick={handleDownload}
          title={`Download ${fileName}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#E6F1FB",
            color: "#185FA5",
            fontWeight: 600,
            fontSize: "11px",
            border: "1px solid #b3d0ef",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c7dff5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E6F1FB")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      );
    },
  },
  { key: "reqDate", header: "REQUEST DATE", minWidth: 240 },
  { key: "rosterNo", header: "ROSTER NO", minWidth: 140 },

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
      return <span className="text-slate-400">-</span>;
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

  const shortlisted = rows.filter((d) => d.result === "Shortlisted").length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 text-sm font-semibold text-slate-700 min-w-[160px]">
        Status of Applications
      </span>
      <div className="flex flex-wrap gap-2">


        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {shortlisted} Shortlisted
        </span>

      </div>
    </div>
  );
}


export default function StatusOfApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
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



  return (
    <AdminLayout
      title="Status of Applications"
      subtitle="Land Data Management System - Application Tracker"
    >
      <div className="lms-data-transition space-y-6">
        <PageSummaryBar rows={rows} />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="w-full overflow-x-auto rounded-xl">
          <AgGridTable
            columns={columns}
            rows={rows}
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
