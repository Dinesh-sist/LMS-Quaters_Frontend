import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AgGridTable from "../../Components/Table";
import EmployeeLayout from "./EmployeeUI/EmployeeLayout";
import { request, API_BASE, getLatestPublication } from "../../api";
import { getUser } from "../../auth";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
  cancelled: "bg-slate-100 text-slate-600",
};

function statusLabel(value) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const columns = [
  { key: "AppNo", header: "APP NO", minWidth: 140 },
  { key: "EmpId", header: "EMP ID", minWidth: 130 },
  { key: "EmpName", header: "EMP NAME", minWidth: 200 },
  { key: "Class", header: "CLASS", minWidth: 140 },
  { key: "Caste", header: "CASTE", minWidth: 110 },
  { key: "GradDate", header: "GRAD DATE", minWidth: 130 },
  { key: "EmailId", header: "EMAIL", minWidth: 210 },
  { key: "ReqDate", header: "REQ DATE", minWidth: 120 },
  { key: "QtrRequested", header: "REQUESTED QTR", minWidth: 140 },
  { key: "QtrLocation", header: "LOCATION", minWidth: 190 },
  { key: "QtrType", header: "QTR TYPE", minWidth: 130 },
  { key: "Reason", header: "REASON", minWidth: 140 },
  { key: "ExchangeReason", header: "EXCHANGE REASON", minWidth: 200 },
  {
    key: "AttachmentPath",
    header: "ATTACHMENT",
    minWidth: 160,
    render: (value) => {
      if (!value) return <span className="text-slate-400 text-xs">—</span>;

      const normalised = value.replace(/\\/g, "/").replace(/^.*uploads\//, "");
      const fileUrl = `${API_BASE}/uploads/${normalised}`;
      const fileName = normalised.split("/").pop();

      // Blob-fetch forces a real download instead of opening in the browser tab
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
            textDecoration: "none",
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
  {
    key: "PublishedDateFrom",
    header: "PUBLISHED FROM",
    minWidth: 150,
    render: (value) => formatDate(value),
  },
  {
    key: "PublishedDateTo",
    header: "PUBLISHED TO",
    minWidth: 150,
    render: (value) => formatDate(value),
  },
  {
    key: "Status",
    header: "STATUS",
    minWidth: 180,
    render: (value) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[value?.toLowerCase()] || "bg-slate-100 text-slate-600"
          }`}
      >
        {statusLabel(value)}
      </span>
    ),
  },
];

function PageSummaryBar({ rows }) {
  const totalRequests = rows.length;
  const approved = rows.filter((r) => r.Status?.toLowerCase() === "approved").length;
  const inProgress = rows.filter((r) => r.Status?.toLowerCase() === "pending").length;
  const rejected = rows.filter((r) => r.Status?.toLowerCase() === "rejected").length;

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
  const { state } = useLocation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(!!state?.successMessage);
  const [viewMode, setViewMode] = useState("current");
  const [currentPublication, setCurrentPublication] = useState(null);
  const user = getUser();

  useEffect(() => {
    let isActive = true;
    request("/api/admin/check-approval", { auth: true })
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

  const currentWindowKey = {
    from: toDateKey(currentPublication?.From_Date),
    to: toDateKey(currentPublication?.To_Date),
  };

  const currentApplicationRows = rows.filter((row) => {
    if (!currentWindowKey.from || !currentWindowKey.to) return false;
    return (
      toDateKey(row?.PublishedDateFrom) === currentWindowKey.from &&
      toDateKey(row?.PublishedDateTo) === currentWindowKey.to
    );
  });

  const historyApplicationRows = rows.filter((row) => {
    if (!currentWindowKey.from || !currentWindowKey.to) return true;
    return !(
      toDateKey(row?.PublishedDateFrom) === currentWindowKey.from &&
      toDateKey(row?.PublishedDateTo) === currentWindowKey.to
    );
  });

  const visibleRows = viewMode === "history" ? historyApplicationRows : currentApplicationRows;

  //fetch the data's form the database and  display in the table format with the help of ag-grid table and also display the status of the application with the help of the status column and also display the success message if the application is approved or rejected or pending or cancelled and also display the error message if there is any error in fetching the data from the database and also display the loading message while fetching the data from the database and also display the empty message if there is no data in the database and also display the total number of requests and also display the number of approved requests and also display the number of pending requests and also display the number of rejected requests in the page summary bar.
  return (
    <EmployeeLayout
      title="Check Status of Your Applications"
      subtitle="Land Data Management System - Approval Tracker"
      role="user"
      description="Approval Tracking"
      welcomeName={user?.name || user?.username || "Employee"} logoutTo="/QuartersApplyLogin"
      headerRight={
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("current")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              viewMode === "current"
                ? "bg-[#1b2d69] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Current Applications
          </button>
          <button
            type="button"
            onClick={() => setViewMode("history")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              viewMode === "history"
                ? "bg-[#1b2d69] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            History of Applications
          </button>
        </div>
      }
    >

      {/* Success Banner */}
      {showBanner && state?.successMessage && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
          <span className="text-emerald-500 text-[20px]">✓</span>
          <div className="text-[13px] font-semibold text-emerald-700 flex-1">
            {state.successMessage}
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="text-emerald-400 hover:text-emerald-600 font-bold text-[16px]"
          >
            ✕
          </button>
        </div>
      )}

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
          searchPlaceholder="Search employee, quarter, status..."
          emptyMessage={loading ? "Loading approval statuses..." : "No approval records found."}
        />
      </div>
    </EmployeeLayout>
  );
}

