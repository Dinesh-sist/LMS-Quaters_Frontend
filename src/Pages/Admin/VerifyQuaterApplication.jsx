import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request } from "../../api";

const stageStyles = {
  "Ready for review": "bg-amber-100 text-amber-700",
  "Under scrutiny":   "bg-blue-100 text-blue-700",
  Shortlisted:        "bg-emerald-100 text-emerald-700",
};

const columns = [
  { key: "appNo",      header: "APP NO",       minWidth: 110 },
  { key: "empId",      header: "EMP ID",       renderer: "empId",  minWidth: 125 },
  { key: "empName",    header: "EMP NAME",     minWidth: 220 },
  { key: "class",      header: "CLASS",        renderer: "class",  minWidth: 150 },
  { key: "gradDate",   header: "GRAD DATE",    minWidth: 135 },
  { key: "dateOfJoin", header: "DATE OF JOIN", minWidth: 150 },
  { key: "basic",      header: "BASIC",        renderer: "basic",  minWidth: 120 },
  { key: "dob",        header: "DATE OF BIRTH", minWidth: 130 },
  { key: "dept",       header: "DEPARTMENT",   minWidth: 180 },
  { key: "casteID",     header: "CASTE ID",     minWidth: 120 },
  { key: "currentQtr", header: "CURRENT QTR",  minWidth: 130 },
  { key: "currentQtrType", header: "CURRENT QTR TYPE",  minWidth: 160 },
  { key: "requestedQtr", header: "REQ QTR",  minWidth: 130 },
  { key: "requestedQtrLocation", header: "REQ QTR LOCATION",  minWidth: 180 },
  { key: "requestedQtrType", header: "REQ QTR TYPE",  minWidth: 150 },
  { key: "exchangeQtr", header: "EXCHANGE QTR",  minWidth: 130 },
  { key: "proofFile", header: "PROOF FILE",  minWidth: 130 },
  { key: "requestedDate", header: "REQUESTED DATE",  minWidth: 150 },

    {
      
    key: "stage",
    header: "REVIEW STAGE",
    minWidth: 170,
    render: (value) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          stageStyles[value] || "bg-slate-100 text-slate-600"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "action",
    header: "ACTION",
    minWidth: 120,
    render: () => (
      <button
        type="button"
        className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        Review
      </button>
    ),
  },
];

/* ── Option 2: Title row with inline metric badges ── */
function PageSummaryBar({ rows }) {
  const total = rows.length;
  const pending = rows.filter((d) => d.stage === "Ready for review").length;
  const allocated = rows.filter((d) => d.stage === "Shortlisted").length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 text-sm font-semibold text-slate-700 min-w-[160px]">
        Verify Quarter Applications
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {total} Total  Quarter Applications
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {pending} Pending review
        </span>
        
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {allocated} Allocated
        </span>
      </div>
    </div>
  );
}

export default function VerifyQuarterApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    request("/api/admin/verify-quarter-applications", { auth: true })
      .then((data) => {
        if (isActive) setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        if (isActive) setError(fetchError?.message || "Failed to load verify applications.");
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
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Committee Review"
    >
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
          emptyMessage={loading ? "Loading verify applications..." : "No verify applications found."}
        />
      </div>
    </AdminLayout>
  );
}
