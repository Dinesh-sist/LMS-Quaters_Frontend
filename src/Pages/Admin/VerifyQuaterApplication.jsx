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

const statCards = [
  {
    label: "Total Applications",
    value: String(mockData.length),
    color: "from-violet-600 to-indigo-600",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Pending Review",
    value: String(mockData.filter((item) => item.stage === "Ready for review").length),
    color: "from-blue-500 to-blue-600",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Under Scrutiny",
    value: String(mockData.filter((item) => item.stage === "Under scrutiny").length),
    color: "from-rose-500 to-pink-600",
    icon: "M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z",
  },
  {
    label: "Shortlisted",
    value: String(mockData.filter((item) => item.stage === "Shortlisted").length),
    color: "from-amber-500 to-orange-500",
    icon: "M5 13l4 4L19 7",
  },
];

const stageStyles = {
  "Ready for review": "bg-amber-100 text-amber-700",
  "Under scrutiny": "bg-blue-100 text-blue-700",
  Shortlisted: "bg-emerald-100 text-emerald-700",
};

const columns = [
  { key: "appNo", header: "APP NO", minWidth: 110 },
  { key: "empId", header: "EMP ID", renderer: "empId", minWidth: 125 },
  { key: "empName", header: "EMP NAME", minWidth: 220 },
  { key: "class", header: "CLASS", renderer: "class", minWidth: 150 },
  { key: "gradDate", header: "GRAD DATE", minWidth: 135 },
  { key: "dateOfJoin", header: "DATE OF JOIN", minWidth: 150 },
  { key: "basic", header: "BASIC", renderer: "basic", minWidth: 120 },
  { key: "dept", header: "DEPARTMENT", minWidth: 180 },
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

export default function VerifyQuarterApplications() {
  return (
    <AdminLayout
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Committee Review"
    >
      <StatCards />

      <AgGridTable
        columns={columns}
        rows={mockData}
        searchable
        pageSize={8}
        showExport
        showFilter
      />
    </AdminLayout>
  );
}
