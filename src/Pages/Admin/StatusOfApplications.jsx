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
  Rejected:  "bg-rose-100 text-rose-700",
  Pending:   "bg-amber-100 text-amber-700",
};

const columns = [
  { key: "appNo",      header: "APP NO",         minWidth: 130 },
  { key: "empId",      header: "EMP ID",         renderer: "empId", minWidth: 135 },
  { key: "empName",    header: "EMP NAME",       minWidth: 220 },
  { key: "class",      header: "CLASS",          renderer: "class", minWidth: 155 },
  { key: "grad date",   header: "GRAD DATE",      minWidth: 135 },
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
function PageSummaryBar() {

  const Shortlished =  mockData.filter((d) => d.result === "Shortlisted").length;

    const Roster = mockData.filter((d) => d.result === "Approved").length;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="flex-1 text-sm font-semibold text-slate-700 min-w-[160px]">
        Status of Applications
      </span>
      <div className="flex flex-wrap gap-2">
      
      
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {Shortlished} Shortlisted
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {Roster} Roster
        </span>       
      </div>
    </div>  
  );
}

export default function StatusOfApplications() {
  return (
    <AdminLayout
      title="Status of Applications"
      subtitle="Land Data Management System - Application Tracker"
    >
      <PageSummaryBar />

      <div className="w-full overflow-x-auto rounded-xl">
        <AgGridTable
          columns={columns}
          rows={mockData}
          searchable
          pageSize={8}
          showExport
          showFilter
        />
      </div>
    </AdminLayout>
  );
}
