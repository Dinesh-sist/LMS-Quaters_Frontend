import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import EmployeeLayout from "./EmployeeUI/EmployeeLayout";
import { request } from "../../api";

// ── Status styles keyed to exact values your DB stores ──
const statusStyles = {
  approved:             "bg-emerald-100 text-emerald-700",
  pending:              "bg-amber-100 text-amber-700",
  rejected:             "bg-rose-100 text-rose-700",
  cancelled:            "bg-slate-100 text-slate-600",
};

// ── Helper: normalise display label ──
function statusLabel(value) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// ── Columns use PascalCase keys that match your DB recordset ──
const columns = [
  {key :"Id",           header: "ID",                minWidth: 80 },
  {key :"Priority",     header: "PRIORITY",          minWidth: 80 },
  {key :"UserId",       header: "USER ID",           minWidth: 80 },
  { key: "EmpId",        header: "EMP ID",          renderer: "empId", minWidth: 140 },
  { key: "EmpName",      header: "EMP NAME",         minWidth: 220 },
  { key: "Class",        header: "CLASS",            renderer: "class", minWidth: 155 },
  {key :"cast",          header: "CAST",              minWidth: 120 },
  { key: "AllotCatId",   header: "ALLOT CAT ID",     minWidth: 150 },
  {key :"EmailId",       header: "EMAILID",             minWidth: 220 },
  {key :"reqdate",       header: "REQ DATE",            minWidth: 145 },
  { key: "QtrRequested", header: "REQUESTED QTR",    minWidth: 150 },
  { key: "QtrLocation",  header: "QTR LOCATION",     minWidth: 220 },
  {key :"Qtrtype",      header: "QTR TYPE",         minWidth: 150 },
  {key :"ExchangeReason",       header: "ExchangeReason",           minWidth: 250 },
  {key: "AttachmentPath",   header: "ATTACHMENTPATH",     minWidth: 150 },
  
  {
    key: "Status",
    header: "STATUS",
    minWidth: 180,
    render: (value) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          statusStyles[value?.toLowerCase()] || "bg-slate-100 text-slate-600"
        }`}
      >
        {statusLabel(value)}
      </span>
    ),
  },
];

// ── Summary bar — counts use lowercase comparison ──
function PageSummaryBar({ rows }) {
  const totalRequests  = rows.length;
  const approved       = rows.filter((r) => r.Status?.toLowerCase() === "approved").length;
  const inProgress     = rows.filter((r) => r.Status?.toLowerCase() === "pending").length;
  const rejected       = rows.filter((r) => r.Status?.toLowerCase() === "rejected").length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-[160px] flex-1 text-sm font-semibold text-slate-700">
        Check Approval Status
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {totalRequests} Total Requests
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {approved} Approved
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {inProgress} Pending
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          {rejected} Rejected
        </span>
      </div>
    </div>
  );
}

export default function CheckApproval() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let isActive = true;
    request("/api/applications/check-approval", { auth: true })
      .then((data) => {
        if (isActive) setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        if (isActive) setError(fetchError?.message || "Failed to load approval statuses.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <EmployeeLayout
      title="Check Approval Status"
      subtitle="Land Data Management System - Approval Tracker"
      role="user"
      description="Approval Tracking"
      welcomeName="Applicant"
      logoutTo="/QuartersApplyLogin"
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
          searchPlaceholder="Search employee, quarter, status..."
          emptyMessage={loading ? "Loading approval statuses..." : "No approval records found."}
        />
      </div>
    </EmployeeLayout>
  );
}