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
    stage: "Ready for review",
  },
  {
    id: 2,
    appNo: 2601,
    empId: "E1945",
    empName: "RAJENDRA PRASAD NAYAK",
    class: "SR-CLASS-II",
    gradDate: "2020-03-15",
    dateOfJoin: "1995-04-10",
    basic: 89500,
    dob: "1969-11-22",
    dept: "Mechanical",
    stage: "Under scrutiny",
  },
  {
    id: 3,
    appNo: 2615,
    empId: "E2105",
    empName: "SURESH KUMAR MISHRA",
    class: "SR-CLASS-I",
    gradDate: "2017-06-30",
    dateOfJoin: "1990-01-15",
    basic: 115000,
    dob: "1965-03-08",
    dept: "Civil Engineering",
    stage: "Shortlisted",
  },
  {
    id: 4,
    appNo: 2630,
    empId: "E1876",
    empName: "BIBHUTI BHUSAN DAS",
    class: "SR-CLASS-II",
    gradDate: "2021-09-10",
    dateOfJoin: "1998-07-20",
    basic: 78000,
    dob: "1972-09-14",
    dept: "Electrical",
    stage: "Ready for review",
  },
];

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
  { key: "dept",       header: "DEPARTMENT",   minWidth: 180 },
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
function PageSummaryBar() {
  const total    = mockData.length;
  const pending  = mockData.filter((d) => d.stage === "Ready for review").length;
  const allocated = mockData.filter((d) => d.stage === "Shortlisted").length;

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
  return (
    <AdminLayout
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Committee Review"
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