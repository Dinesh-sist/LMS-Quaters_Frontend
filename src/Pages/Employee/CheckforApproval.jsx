import AgGridTable from "../../Components/Table";
import EmployeeLayout from "./EmployeeUI/EmployeeLayout";

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
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  "Clarification Needed": "bg-rose-100 text-rose-700",
};

const columns = [
  { key: "empId", header: "EMP ID", renderer: "empId", minWidth: 140 },
  { key: "empName", header: "EMP NAME", minWidth: 220 },
  { key: "class", header: "CLASS", renderer: "class", minWidth: 155 },
  { key: "allotCatId", header: "ALLOT CAT ID", minWidth: 150 },
  { key: "qtrReq", header: "REQUESTED QTR", minWidth: 150 },
  { key: "qtrLocation", header: "QTR LOCATION", minWidth: 220 },
  { key: "reqDate", header: "REQUEST DATE", minWidth: 145 },
  {
    key: "status",
    header: "STATUS",
    minWidth: 180,
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

function PageSummaryBar() {
  const totalRequests = approvalRows.length;
  const approved = approvalRows.filter((row) => row.status === "Approved").length;
  const inProgress = approvalRows.filter(
    (row) => row.status === "Pending" || row.status === "Under Review"
  ).length;
  const clarifications = approvalRows.filter(
    (row) => row.status === "Clarification Needed"
  ).length;

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
          {inProgress} In Progress
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          {clarifications} Clarifications
        </span>
      </div>
    </div>
  );
}

export default function CheckApproval() {
  return (
    <EmployeeLayout
      title="Check Approval Status"
      subtitle="Land Data Management System - Approval Tracker"
      role="user"
      description="Approval Tracking"
      welcomeName="Applicant"
      logoutTo="/QuartersApplyLogin"
    >
      <PageSummaryBar />

      <div className="w-full overflow-x-auto rounded-xl">
        <AgGridTable
          columns={columns}
          rows={approvalRows}
          searchable
          pageSize={8}
          showExport
          showFilter
          searchPlaceholder="Search employee, quarter, status..."
        />
      </div>

      <div className="flex flex-col gap-2 px-1 text-[13px] text-slate-500 md:flex-row md:items-center md:justify-between">
        <span>Copyright 2026 Paradip Port Authority</span>
        <span>Real Estate Management System</span>
      </div>
    </EmployeeLayout>
  );
}
