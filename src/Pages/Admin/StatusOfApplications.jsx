import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";

const mockData = [
  {
    id: 1,
    appNo: 2591,
    empId: "E2310",
    empName: "SANGRAM K. SAMAL",
    class: "SR-CLASS-I",
    gradDate: "2018-01-20",
    dateOfJoin: "1991-08-08",
    basic: 102060,
    dob: "1971-06-15",
    dept: "Chief Engineering",
    casteId: "GEN",
    currentQtr: "B-12",
    currentQtyType: "TYPE-A",
    reqQtr: "A-04",
    reqQtrLocation: "Colony-1",
    reqQtrType: "TYPE-B",
    exchange: "Yes",
    proofFile: "proof_001.pdf",
    reqDate: "2024-03-10",
    rosterNo: "RST-101",
    result: "Pending",
  },
  {
    id: 2,
    appNo: 2592,
    empId: "E2311",
    empName: "MAMATA KUMARI PANDA",
    class: "SR-CLASS-II",
    gradDate: "2022-02-14",
    dateOfJoin: "2000-08-12",
    basic: 72000,
    dob: "1975-02-18",
    dept: "Finance",
    casteId: "OBC",
    currentQtr: "F-02",
    currentQtyType: "TYPE-C",
    reqQtr: "E-05",
    reqQtrLocation: "Colony-5",
    reqQtrType: "TYPE-B",
    exchange: "No",
    proofFile: "proof_008.pdf",
    reqDate: "2024-03-17",
    rosterNo: "RST-108",
    result: "Approved",
  },
  {
    id: 3,
    appNo: 2578,
    empId: "E2279",
    empName: "PRODOSH K. MOHANTY",
    class: "SR-CLASS-I",
    gradDate: "2019-10-19",
    dateOfJoin: "1991-08-09",
    basic: 102060,
    dob: "1968-06-01",
    dept: "Chief Engineering",
    casteId: "OBC",
    currentQtr: "C-05",
    currentQtyType: "TYPE-B",
    reqQtr: "B-08",
    reqQtrLocation: "Colony-2",
    reqQtrType: "TYPE-A",
    exchange: "Yes",
    proofFile: "proof_003.pdf",
    reqDate: "2024-03-12",
    rosterNo: "RST-103",
    result: "Rejected",
  },
  {
    id: 4,
    appNo: 2601,
    empId: "E1945",
    empName: "RAJENDRA PRASAD NAYAK",
    class: "SR-CLASS-II",
    gradDate: "2020-03-15",
    dateOfJoin: "1995-04-10",
    basic: 89500,
    dob: "1969-11-22",
    dept: "Mechanical",
    casteId: "SC",
    currentQtr: "D-11",
    currentQtyType: "TYPE-C",
    reqQtr: "C-02",
    reqQtrLocation: "Colony-3",
    reqQtrType: "TYPE-A",
    exchange: "No",
    proofFile: "proof_004.pdf",
    reqDate: "2024-03-13",
    rosterNo: "RST-104",
    result: "Pending",
  },
];

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Pending: "bg-amber-100 text-amber-700",
};

const approved = mockData.filter((item) => item.result === "Approved").length;
const pending = mockData.filter((item) => item.result === "Pending").length;
const rejected = mockData.filter((item) => item.result === "Rejected").length;

const statCards = [
  {
    label: "Total Applications",
    value: String(mockData.length),
    color: "from-violet-600 to-indigo-600",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Approved",
    value: String(approved),
    color: "from-emerald-500 to-green-600",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Pending",
    value: String(pending), 
    color: "from-amber-400 to-orange-500",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Rejected",
    value: String(rejected),
    color: "from-rose-500 to-pink-600",
    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const columns = [
  { key: "appNo", header: "APP NO", minWidth: 110 },
  { key: "empId", header: "EMP ID", renderer: "empId", minWidth: 125 },
  { key: "empName", header: "EMP NAME", minWidth: 220 },
  { key: "class", header: "CLASS", renderer: "class", minWidth: 150 },
  { key: "dept", header: "DEPARTMENT", minWidth: 180 },
  { key: "currentQtr", header: "CURRENT QTR", minWidth: 135 },
  { key: "reqQtr", header: "REQUESTED QTR", minWidth: 145 },
  { key: "reqDate", header: "REQUEST DATE", minWidth: 135 },
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

function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} px-5 py-4 text-white shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold leading-none">{card.value}</p>
              <p className="mt-1.5 text-xs font-medium leading-tight text-white/80">
                {card.label}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 -right-1 h-9 w-9 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function StatusOfApplications() {
  return (
    <AdminLayout
      title="Status of Applications"
      subtitle="Land Data Management System - Application Tracker"
    >
      <StatCards />

      <AgGridTable
        columns={columns}
        rows={mockData}
        title="Application Status Register"
        subtitle="Quarter Review Dashboard"
        badgeText={`${mockData.length} applications`}
        badgeLabel="Live status"
        searchable
        pageSize={8}
        showExport
        showFilter
      />
    </AdminLayout>
  );
}
