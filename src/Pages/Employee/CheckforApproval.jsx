import AgGridTable from "../../Components/Table";
import TopHeader from "../../Components/TopHeader";
import Sidebar from "./EmployeeUI/EmployeeSideNav";

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

function PriorityRenderer({ value }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 36,
        height: 36,
        padding: "0 11px",
        borderRadius: 999,
        background: "linear-gradient(135deg, #3147b2, #5666df)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
        boxShadow: "0 8px 18px rgba(79,97,200,0.22)",
      }}
    >
      {value}
    </span>
  );
}

function NameRenderer({ value }) {
  return <span style={{ color: "#3b475c", fontWeight: 700, whiteSpace: "nowrap" }}>{value}</span>;
}

function EmailRenderer({ value }) {
  return <span style={{ color: "#58657d", fontWeight: 500, whiteSpace: "nowrap" }}>{value}</span>;
}

function QuarterRenderer({ value, data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
      <span style={{ fontWeight: 700, color: "#3147b2" }}>{value}</span>
      <span style={{ fontSize: 11, color: "#7b879c" }}>{data.qtrType}</span>
    </div>
  );
}

function StatusRenderer({ value }) {
  const styles = {
    Approved: { color: "#118747", background: "#d8f7df", border: "#c0efcb" },
    Rejected: { color: "#d81d2f", background: "#ffe4e7", border: "#fec7cd" },
    Pending: { color: "#b76a09", background: "#fff1d6", border: "#fed7aa" },
    "Under Review": { color: "#3151da", background: "#e6ecff", border: "#cfd8ff" },
    "Clarification Needed": { color: "#c05621", background: "#ffedd9", border: "#fdc48c" },
  };

  const current = styles[value] || {
    color: "#475569",
    background: "#f1f5f9",
    border: "#cbd5e1",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
        color: current.color,
        background: current.background,
        border: `1px solid ${current.border}`,
      }}
    >
      {value}
    </span>
  );
}

const columns = [
  {
    key: "priorityNo",
    label: "PRIORITY NO",
    minWidth: 150,
    render: (value) => <PriorityRenderer value={value} />,
  },
  { key: "empId", label: "EMP ID", renderer: "empId", minWidth: 130 },
  {
    key: "empName",
    label: "EMP NAME",
    minWidth: 220,
    render: (value) => <NameRenderer value={value} />,
  },
  { key: "class", label: "CLASS", renderer: "class", minWidth: 150 },
  { key: "casteId", label: "CASTE ID", minWidth: 120 },
  { key: "allotCatId", label: "ALLOT CAT ID", minWidth: 145 },
  {
    key: "emailId",
    label: "EMAIL ID",
    minWidth: 250,
    render: (value) => <EmailRenderer value={value} />,
  },
  { key: "reqDate", label: "REQ DATE", minWidth: 135 },
  {
    key: "qtrReq",
    label: "QTR REQ",
    minWidth: 140,
    render: (value, data) => <QuarterRenderer value={value} data={data} />,
  },
  { key: "qtrLocation", label: "QTR LOCATION", minWidth: 220 },
  { key: "qtrType", label: "QTR TYPE", minWidth: 130 },
  {
    key: "status",
    label: "STATUS",
    minWidth: 180,
    render: (value) => <StatusRenderer value={value} />,
  },
];

const stats = [
  {
    label: "Total Requests",
    value: String(approvalRows.length),
    tone: "bg-[#eef2ff] text-[#3344b6] border-[#d6defd]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    label: "Approved",
    value: String(approvalRows.filter((row) => row.status === "Approved").length),
    tone: "bg-[#e8fbef] text-[#14804a] border-[#bcf0cc]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    label: "In Progress",
    value: String(
      approvalRows.filter((row) => row.status === "Pending" || row.status === "Under Review").length
    ),
    tone: "bg-[#fff5e8] text-[#b76a09] border-[#fed7aa]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    label: "Clarifications",
    value: String(approvalRows.filter((row) => row.status === "Clarification Needed").length),
    tone: "bg-[#fff1f2] text-[#c21d4a] border-[#fecdd3]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
      />
    ),
  },
];

export default function CheckApproval() {
  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#e6eeff_0%,#f5f8ff_36%,#edf3ff_100%)]">
      <div className="h-full bg-[#f7faff] overflow-hidden flex flex-col">
        <TopHeader
          role="user"
          description="Approval Tracking"
          welcomeName="Applicant"
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <main className="flex-1 overflow-y-auto px-9 py-7 bg-[#f4f6fa]">
            <div className="mb-[22px]">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-[-0.02em] mb-1.5">
                Check Approval status
              </h2>
              <div className="h-[3px] w-[52px] rounded-sm bg-[#e87722]" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mb-6">
              {stats.map((card) => (
                <div key={card.label} className={`rounded-[20px] border px-4 py-4 ${card.tone}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">
                        {card.label}
                      </div>
                      <div className="mt-2 text-[28px] font-extrabold leading-none">
                        {card.value}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center border border-white/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {card.icon}
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AgGridTable
              columns={columns}
              rows={approvalRows}
              title="Approval Queue Register"
              badgeText={`${approvalRows.length} requests`}
              badgeLabel="Approval Tracker"
              searchable
              pageSize={8}
              showExport
              showFilter
              contentAlign="center"
              variant="soft"
              searchPlaceholder="Search employee, category, location..."
            />

            <div className="flex flex-col gap-2 px-1 pt-4 text-[13px] text-slate-500 md:flex-row md:items-center md:justify-between">
              <span>© 2026 Paradip Port Authority</span>
              <span>Real Estate Management System</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
