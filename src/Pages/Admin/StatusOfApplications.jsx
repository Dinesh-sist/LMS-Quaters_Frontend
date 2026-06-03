import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request } from "../../api";

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected:  "bg-rose-100 text-rose-700",
  Pending:   "bg-amber-100 text-amber-700",
};

const columns = [
  { key: "appNo",      header: "APP NO",         minWidth: 130 },
  { key: "empId",      header: "EMP ID",         renderer: "empId", minWidth: 135 },
  { key: "empName",    header: "EMP NAME",       minWidth: 220 },
  { key: "class",      header: "CLASS",          renderer: "class", minWidth: 155 },
  { key: "gradDate",   header: "GRAD DATE",      minWidth: 135 },
  {key: "dob",        header: "DATE OF BIRTH",             minWidth: 120 },
  { key: "dept",       header: "DEPARTMENT",     minWidth: 180 },
  { key: "casteId",    header: "CASTE ID",       minWidth: 120 },
  { key: "currentQtr", header: "CURRENT QTR",    minWidth: 145 },
  { key: "currentQtyType",       header: "CURRENT QTR TYPE",     minWidth: 180 },
  { key: "reqQtr",     header: "REQUESTED QTR",  minWidth: 145 },
  { key: "reqQtrLocation", header: "REQUESTED QTR LOCATION", minWidth: 220 },
  { key: "reqQtrType", header: "REQUESTED QTR TYPE", minWidth: 180 },
  { key: "exchange",   header: "EXCHANGE",       minWidth: 140 },
   { key: "proofFile",  header: "PROOF FILE",     minWidth: 150 },
  { key: "reqDate",    header: "REQUEST DATE",   minWidth: 140 },
  { key: "rosterNo",   header: "ROSTER NO",      minWidth: 120 },
  
  {
    key: "result",
    header: "STATUS",
    minWidth: 150,
    render: (value) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          statusStyles[value] || "bg-slate-100 text-slate-600"
        }`}
      >
        {value}
      </span>
    ),
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
