import { useEffect, useRef, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, API_BASE } from "../../api";

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
  { key: "AppNo", header: "APP NO", minWidth: 190 },
  { key: "EmpId", header: "EMP ID", minWidth: 130 },
  { key: "EmpName", header: "EMP NAME", minWidth: 200 },
  { key: "Class", header: "CLASS", minWidth: 140 },
  { key: "Basic", header: "BASIC", renderer: "basic", minWidth: 110 },
  { key: "Caste", header: "CASTE", minWidth: 110 },
  { key: "EmailId", header: "EMAIL", minWidth: 210 },
  { key: "ReqDate", header: "REQ DATE", minWidth: 150 },
  { key: "QtrRequested", header: "REQUESTED QTR", minWidth: 240 },

  { key: "QtrLocation", header: "LOCATION", minWidth: 190 },
  { key: "QtrType", header: "QTR TYPE", minWidth: 130 },
  { key: "Reason", header: "REASON", minWidth: 140 },
  {
    key: "Status",
    header: "STATUS",
    minWidth: 140,
    render: (value) => <StatusBadge value={value} />,
  },
  {
    key: "action",
    header: "ACTION",
    minWidth: 120,
    render: (_, row) => (
      <button
        type="button"
        onClick={() => onReview(row)}
        className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
      >
        Review
      </button>
    ),
  },
];

/* ─── Summary bar ─────────────────────────────────────────────── */
function PageSummaryBar({ rows }) {
  const total = rows.length;
  const pending = rows.filter((r) => r.Status?.toLowerCase() === "pending").length;
  const approved = rows.filter((r) => r.Status?.toLowerCase() === "approved").length;
  const rejected = rows.filter((r) => r.Status?.toLowerCase() === "rejected").length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 min-w-[160px] text-sm font-semibold text-slate-700">
        Verify Quarter Applications
      </span>
      <div className="flex flex-wrap gap-2">
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
            <DetailRow label="Email" value={app.EmailId} />
            <DetailRow label="Class" value={app.Class} />
            <DetailRow label="Basic Pay" value={app.Basic} />
            <DetailRow label="Caste" value={app.Caste} />
            <DetailRow label="Date of Joining" value={app.DateOfJoining} />
            <DetailRow label="Grad Date" value={app.GradDate} />
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
            Cancel
          </button>

          {/* Only show Approve/Reject if application is pending */}
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => submit("rejected")}
                disabled={submitting}
                style={{
                  padding: "8px 18px", borderRadius: "8px",
                  border: "1.5px solid #fecdd3", background: "#fff1f2",
                  color: "#be123c", fontSize: "13px", fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}
              >
                {/* X icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {submitting ? "Saving…" : "Reject"}
              </button>

              <button
                type="button"
                onClick={() => submit("approved")}
                disabled={submitting}
                style={{
                  padding: "8px 20px", borderRadius: "8px",
                  border: "none", background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                }}
              >
                {/* Check icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {submitting ? "Saving…" : "Approve"}
              </button>
            </>
          ) : (
            <span style={{ fontSize: "12px", color: "#94a3b8", alignSelf: "center" }}>
              This application has already been <strong>{app.Status?.toLowerCase()}</strong>.
            </span>
          )}
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

  const load = () => {
    setLoading(true);
    setError("");
    request("/api/admin/verify-quarter-applications", { auth: true })
      .then((data) => setRows(Array.isArray(data?.items) ? data.items : []))
      .catch((err) => setError(err?.message || "Failed to load applications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // After approve/reject: update the row in-place instantly
  const handleAction = (id, newStatus, notes) => {
    setRows((prev) =>
      prev.map((r) =>
        r.Id === id ? { ...r, Status: newStatus, Notes: notes } : r
      )
    );
  };

  const columns = makeColumns((row) => setSelected(row));

  return (
    <AdminLayout
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Staff Review"
    >
      <div className="lms-data-transition space-y-6">
        <PageSummaryBar rows={rows} />

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
            rows={rows}
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
