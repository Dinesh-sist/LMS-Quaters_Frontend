import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AgGridTable from "../../Components/Table";
import EmployeeLayout from "./EmployeeUI/EmployeeLayout";
import { request, API_BASE } from "../../api";
import { getUser } from "../../auth";


const approvalRows = [
  {
    id: 1,
    priorityNo: 1,
    empId: "EMP24031",
    empName: "Sanjay Kumar Das",
    class: "SR-CLASS-I",
    casteId: "GEN",
    allotCatId: "CAT-A",
    emailId: "sanjay.das@ppa.gov.in",
    reqDate: "2026-04-28",
    qtrReq: "A-12",
    qtrLocation: "Jhanjhirimangala Colony",
    qtrType: "TYPE-A",
    status: "Approved",
  },
  {
    id: 2,
    priorityNo: 2,
    empId: "EMP24054",
    empName: "Priyanka Sahoo",
    class: "SR-CLASS-II",
    casteId: "OBC",
    allotCatId: "CAT-B",
    emailId: "priyanka.sahoo@ppa.gov.in",
    reqDate: "2026-04-30",
    qtrReq: "B-07",
    qtrLocation: "Nuabazar Colony",
    qtrType: "TYPE-B",
    status: "Under Review",
  },
  {
    id: 3,
    priorityNo: 3,
    empId: "EMP24088",
    empName: "Rakesh Patnaik",
    class: "SR-CLASS-I",
    casteId: "SC",
    allotCatId: "CAT-A",
    emailId: "rakesh.patnaik@ppa.gov.in",
    reqDate: "2026-05-02",
    qtrReq: "C-04",
    qtrLocation: "Officer's Colony",
    qtrType: "TYPE-C",
    status: "Pending",
  },
  {
    id: 4,
    priorityNo: 4,
    empId: "EMP24102",
    empName: "Mamata Mohanty",
    class: "SR-CLASS-II",
    casteId: "ST",
    allotCatId: "CAT-C",
    emailId: "mamata.mohanty@ppa.gov.in",
    reqDate: "2026-05-03",
    qtrReq: "D-15",
    qtrLocation: "Transit Campus",
    qtrType: "TYPE-D",
    status: "Clarification Needed",
  },
  {
    id: 5,
    priorityNo: 5,
    empId: "EMP24114",
    empName: "Anil Behera",
    class: "SR-CLASS-I",
    casteId: "GEN",
    allotCatId: "CAT-B",
    emailId: "anil.behera@ppa.gov.in",
    reqDate: "2026-05-05",
    qtrReq: "A-03",
    qtrLocation: "Marine Drive Colony",
    qtrType: "TYPE-A",
    status: "Approved",
  },
  {
    id: 6,
    priorityNo: 6,
    empId: "EMP24119",
    empName: "Deepa Rout",
    class: "SR-CLASS-II",
    casteId: "OBC",
    allotCatId: "CAT-C",
    emailId: "deepa.rout@ppa.gov.in",
    reqDate: "2026-05-06",
    qtrReq: "B-10",
    qtrLocation: "Jhanjhirimangala Colony",
    qtrType: "TYPE-B",
    status: "Pending",
  },
  {
    id: 7,
    priorityNo: 7,
    empId: "EMP24127",
    empName: "Subrat Panda",
    class: "SR-CLASS-I",
    casteId: "GEN",
    allotCatId: "CAT-A",
    emailId: "subrat.panda@ppa.gov.in",
    reqDate: "2026-05-07",
    qtrReq: "C-09",
    qtrLocation: "Officer's Colony",
    qtrType: "TYPE-C",
    status: "Under Review",
  },
  {
    id: 8,
    priorityNo: 8,
    empId: "EMP24133",
    empName: "Niharika Mishra",
    class: "SR-CLASS-II",
    casteId: "SC",
    allotCatId: "CAT-B",
    emailId: "niharika.mishra@ppa.gov.in",
    reqDate: "2026-05-08",
    qtrReq: "E-02",
    qtrLocation: "Nuabazar Colony",
    qtrType: "TYPE-E",
    status: "Approved",
  },
];


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

  //fetch the data's form the database and  display in the table format with the help of ag-grid table and also display the status of the application with the help of the status column and also display the success message if the application is approved or rejected or pending or cancelled and also display the error message if there is any error in fetching the data from the database and also display the loading message while fetching the data from the database and also display the empty message if there is no data in the database and also display the total number of requests and also display the number of approved requests and also display the number of pending requests and also display the number of rejected requests in the page summary bar.
  return (
    <EmployeeLayout
      title="Check Approval Status"
      subtitle="Land Data Management System - Approval Tracker"
      role="user"
      description="Approval Tracking"
      welcomeName={user?.name || user?.username || "Employee"} logoutTo="/QuartersApplyLogin"
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

