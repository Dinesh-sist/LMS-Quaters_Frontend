import { useEffect, useState } from "react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { request } from "../../api";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const columns = [
  {
    key: "committeeHeld",
    header: "COMMITTEE HELD DATE",
    minWidth: 230,
    value: (row) => formatDate(row.committeeHeld),
    render: (value) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700">
        <svg
          className="h-4 w-4 shrink-0 text-[#185FA5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {value}
      </span>
    ),
  },
  {
    key: "remarks",
    header: "REMARKS",
    minWidth: 210,
    render: (value) => (
      <span className="inline-flex rounded-lg bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#185FA5]">
        {value || "Committee meeting record"}
      </span>
    ),
  },
];

function PageSummaryBar({ rows }) {
  const latestMeeting = [...rows]
    .sort((a, b) => new Date(b.committeeHeld) - new Date(a.committeeHeld))[0];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-[180px] flex-1 text-sm font-semibold text-slate-700">
        History of House Allotment Committee
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {rows.length} Records
        </span>
        {latestMeeting ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Latest: {formatDate(latestMeeting.committeeHeld)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function HistoryOfHouseAllotmentCommittee() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    request("/api/admin/house-allotment-committee-history", { auth: true })
      .then((data) => {
        if (isActive) setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        if (isActive) setError(fetchError?.message || "Failed to load committee history.");
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
      title="History Of House Allotment Committee"
      subtitle="Land Data Management System - Committee Records"
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
            showFilter={false}
            contentAutoWidth={false}
            contentAlign="center"
            emptyMessage={loading ? "Loading committee records..." : "No committee records found."}
            searchPlaceholder="Search committee date..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
            onClick={() => alert("Downloading Final List...")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Final List
          </button>

          
        </div>
      </div>
    </AdminLayout>
  );
}
