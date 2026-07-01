import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request, API_BASE } from "../../api";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100   text-rose-700",
  pending:  "bg-amber-100  text-amber-700",
};

const columns = [
  { key: "priorityNo", header: "PRIORITY NO",    minWidth: 120 },
  { key: "appNo",      header: "APP NO",         minWidth: 130 },
  { key: "empId",      header: "EMP ID",         renderer: "empId", minWidth: 135 },
  { key: "empName",    header: "EMP NAME",       minWidth: 220 },
  { key: "class",      header: "CLASS",          renderer: "class", minWidth: 155 },
  { key: "gradDate",   header: "GRAD DATE",      minWidth: 135 },
  { key: "dob",        header: "DATE OF BIRTH",     minWidth: 120 },
  { key: "casteId",    header: "CASTE ID",       minWidth: 120 },
  { key: "currentQtyType",       header: "CURRENT QTR TYPE",     minWidth: 180 },
  { key: "reqQtr",     header: "REQUESTED QTR",  minWidth: 145 },
  { key: "reqQtrLocation", header: "REQUESTED QTR LOCATION", minWidth: 220 },
  { key: "reqQtrType", header: "REQUESTED QTR TYPE", minWidth: 180 },
  { key: "exchange",   header: "EXCHANGE",       minWidth: 140 },
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
  { key: "reqDate",    header: "REQUEST DATE",   minWidth: 140 },
  { key: "rosterNo",   header: "ROSTER NO",      minWidth: 120 },
  
  {
    key: "result",
    header: "STATUS",
    minWidth: 150,
    render: (value) => {
      const normalized = (value || "").toLowerCase();
      const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            statusStyles[normalized] || "bg-slate-100 text-slate-600"
          }`}
        >
          {label}
        </span>
      );
    },
  },
];

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

  useEffect(() => {
    let isActive = true;

    request("/api/admin/status-of-applications", { auth: true })
      .then((data) => {
        if (isActive) setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        if (isActive) setError(fetchError?.message || "Failed to load application statuses.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

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
    </AdminLayout>
  );
}
