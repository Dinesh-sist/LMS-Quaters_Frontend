import AgGridTable from "../Admin/AdminUI/Table";
import AdminLayout from "./AdminUI/AdminLayout";

/* ─── Mock data ─────────────────────────────────────────── */
const mockData = [
  { id: 1,  appNo: 2591, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 2,  appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 3,  appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 4,  appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 5,  appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 6,  appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",       class: "SR-CLASS-I",  gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 7,  appNo: 2578, empId: "E2279", empName: "PRODOSH K. MOHANTY",     class: "SR-CLASS-I",  gradDate: "2019-10-19", dateOfJoin: "1991-08-09", basic: 102060, dob: "1968-06-01", dept: "Chief Engineering" },
  { id: 8,  appNo: 2601, empId: "E1945", empName: "RAJENDRA PRASAD NAYAK",  class: "SR-CLASS-II", gradDate: "2020-03-15", dateOfJoin: "1995-04-10", basic: 89500,  dob: "1969-11-22", dept: "Mechanical" },
  { id: 9,  appNo: 2615, empId: "E2105", empName: "SURESH KUMAR MISHRA",    class: "SR-CLASS-I",  gradDate: "2017-06-30", dateOfJoin: "1990-01-15", basic: 115000, dob: "1965-03-08", dept: "Civil Engineering" },
  { id: 10, appNo: 2630, empId: "E1876", empName: "BIBHUTI BHUSAN DAS",     class: "SR-CLASS-II", gradDate: "2021-09-10", dateOfJoin: "1998-07-20", basic: 78000,  dob: "1972-09-14", dept: "Electrical" },
  { id: 11,  appNo: 2645, empId: "E2450", empName: "PRADEEP KUMAR JENA",     class: "SR-CLASS-I",  gradDate: "2016-11-25", dateOfJoin: "1989-03-05", basic: 120000, dob: "1963-07-30", dept: "Chief Engineering" },
  { id: 12,  appNo: 2660, empId: "E2311", empName: "MAMATA KUMARI PANDA",    class: "SR-CLASS-II", gradDate: "2022-02-14", dateOfJoin: "2000-08-12", basic: 72000,  dob: "1975-02-18", dept: "Finance" },
  { id: 13,  appNo: 2675, empId: "E2198", empName: "ARUN KUMAR SAHOO",       class: "SR-CLASS-I",  gradDate: "2015-05-20", dateOfJoin: "1988-10-01", basic: 130000, dob: "1961-10-05", dept: "Civil Engineering" },
];

/* ─── Stat cards ─────────────────────────────────────────── */
const statCards = [
  {
    label: "Total Applications",
    value: "13",
    gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    label: "Pending Review",
    value: "08",
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Ready for Verification",
    value: "05",
    gradient: "linear-gradient(135deg, #fb7185, #e11d48)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Approved",
    value: "12",
    gradient: "linear-gradient(135deg, #fb923c, #f59e0b)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
  },
];

/* ─── Column definitions ─────────────────────────────────── */
const columns = [
  { key: "appNo",      label: "APP NO",         width: 100                                      },
  { key: "empId",      label: "EMP ID",         width: 105, renderer: "empId"                  },
  {
    key: "empName",
    label: "EMP NAME",
    flex: 1,
    minWidth: 180,
    render: (val) => (
      <span style={{ fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap" }}>{val}</span>
    ),
  },
  { key: "class",      label: "CLASS",          width: 130, renderer: "class"                  },
  { key: "gradDate",   label: "GRAD DATE",      width: 120                                      },
  { key: "dateOfJoin", label: "DATE OF JOIN",   width: 130                                      },
  { key: "basic",      label: "BASIC",          width: 130, renderer: "basic"                  },
  { key: "dob",        label: "DATE OF BIRTH",  width: 130                                      },
  { key: "dept",       label: "DEPT",           flex: 1, minWidth: 140                          },
  { key: "id",         label: "ACTION",         width: 110, sortable: false, renderer: "action" },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function VerifyQuarterApplication() {
  return (
    <AdminLayout
      title="Verify Quarter Applications"
      subtitle="Land Data Management System - Committee Review"
    >
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
            style={{ background: card.gradient }}
          >
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-white/80 text-sm mt-1">{card.label}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-8 w-14 h-14 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <AgGridTable
        columns={columns}
        rows={mockData}
        title="Quarter Application Register"
        subtitle="Committee Review Queue"
        badgeText={`${mockData.length} applications`}
        badgeLabel="Ready for verification"
        searchable
        pageSize={10}
        height={400}
        showExport
        showFilter
      />
    </AdminLayout>
  );
}
