import AgGridTable from "../Admin/AdminUI/Table";
import AdminLayout from "./AdminUI/AdminLayout";

/* ─── Mock data ─────────────────────────────────────────── */
const mockData = [
  {
    id: 1, appNo: 2591, empId: "E2310", empName: "SANGRAM K. SAMAL",
    class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08",
    basic: 102060, dob: "1971-06-15", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-12", currentQtyType: "TYPE-A",
    reqQtr: "A-04", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "Yes", proofFile: "proof_001.pdf", reqDate: "2024-03-10",
    rosterNo: "RST-101", result: "Pending",
  },
  {
    id: 2, appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",
    class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08",
    basic: 102060, dob: "1971-06-15", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-12", currentQtyType: "TYPE-A",
    reqQtr: "A-04", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "No", proofFile: "proof_002.pdf", reqDate: "2024-03-11",
    rosterNo: "RST-102", result: "Approved",
  },
  {
    id: 3, appNo: 2578, empId: "E2279", empName: "PRODOSH K. MOHANTY",
    class: "SR-CLASS-I", gradDate: "2019-10-19", dateOfJoin: "1991-08-09",
    basic: 102060, dob: "1968-06-01", dept: "Chief Engineering",
    casteId: "OBC", currentQtr: "C-05", currentQtyType: "TYPE-B",
    reqQtr: "B-08", reqQtrLocation: "Colony-2", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_003.pdf", reqDate: "2024-03-12",
    rosterNo: "RST-103", result: "Rejected",
  },
  {
    id: 4, appNo: 2601, empId: "E1945", empName: "RAJENDRA PRASAD NAYAK",
    class: "SR-CLASS-II", gradDate: "2020-03-15", dateOfJoin: "1995-04-10",
    basic: 89500, dob: "1969-11-22", dept: "Mechanical",
    casteId: "SC", currentQtr: "D-11", currentQtyType: "TYPE-C",
    reqQtr: "C-02", reqQtrLocation: "Colony-3", reqQtrType: "TYPE-A",
    exchange: "No", proofFile: "proof_004.pdf", reqDate: "2024-03-13",
    rosterNo: "RST-104", result: "Pending",
  },
  {
    id: 5, appNo: 2615, empId: "E2105", empName: "SURESH KUMAR MISHRA",
    class: "SR-CLASS-I", gradDate: "2017-06-30", dateOfJoin: "1990-01-15",
    basic: 115000, dob: "1965-03-08", dept: "Civil Engineering",
    casteId: "GEN", currentQtr: "A-03", currentQtyType: "TYPE-A",
    reqQtr: "A-07", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "Yes", proofFile: "proof_005.pdf", reqDate: "2024-03-14",
    rosterNo: "RST-105", result: "Approved",
  },
  {
    id: 6, appNo: 2630, empId: "E1876", empName: "BIBHUTI BHUSAN DAS",
    class: "SR-CLASS-II", gradDate: "2021-09-10", dateOfJoin: "1998-07-20",
    basic: 78000, dob: "1972-09-14", dept: "Electrical",
    casteId: "ST", currentQtr: "E-07", currentQtyType: "TYPE-B",
    reqQtr: "D-03", reqQtrLocation: "Colony-4", reqQtrType: "TYPE-C",
    exchange: "No", proofFile: "proof_006.pdf", reqDate: "2024-03-15",
    rosterNo: "RST-106", result: "Pending",
  },
  {
    id: 7, appNo: 2645, empId: "E2450", empName: "PRADEEP KUMAR JENA",
    class: "SR-CLASS-I", gradDate: "2016-11-25", dateOfJoin: "1989-03-05",
    basic: 120000, dob: "1963-07-30", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-09", currentQtyType: "TYPE-A",
    reqQtr: "A-01", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_007.pdf", reqDate: "2024-03-16",
    rosterNo: "RST-107", result: "Approved",
  },
  {
    id: 8, appNo: 2660, empId: "E2311", empName: "MAMATA KUMARI PANDA",
    class: "SR-CLASS-II", gradDate: "2022-02-14", dateOfJoin: "2000-08-12",
    basic: 72000, dob: "1975-02-18", dept: "Finance",
    casteId: "OBC", currentQtr: "F-02", currentQtyType: "TYPE-C",
    reqQtr: "E-05", reqQtrLocation: "Colony-5", reqQtrType: "TYPE-B",
    exchange: "No", proofFile: "proof_008.pdf", reqDate: "2024-03-17",
    rosterNo: "RST-108", result: "Rejected",
  },
  {
    id: 9, appNo: 2675, empId: "E2198", empName: "ARUN KUMAR SAHOO",
    class: "SR-CLASS-I", gradDate: "2015-05-20", dateOfJoin: "1988-10-01",
    basic: 130000, dob: "1961-10-05", dept: "Civil Engineering",
    casteId: "GEN", currentQtr: "A-06", currentQtyType: "TYPE-A",
    reqQtr: "A-09", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_009.pdf", reqDate: "2024-03-18",
    rosterNo: "RST-109", result: "Approved",
  },
  {
    id: 10, appNo: 2688, empId: "E2012", empName: "SUSHANT KUMAR PATI",
    class: "SR-CLASS-II", gradDate: "2023-01-05", dateOfJoin: "2002-06-15",
    basic: 65000, dob: "1978-04-22", dept: "HR",
    casteId: "SC", currentQtr: "G-01", currentQtyType: "TYPE-C",
    reqQtr: "F-04", reqQtrLocation: "Colony-6", reqQtrType: "TYPE-C",
    exchange: "No", proofFile: "proof_010.pdf", reqDate: "2024-03-19",
    rosterNo: "RST-110", result: "Pending",
  },
];

/* ─── Result badge renderer ──────────────────────────────── */
function ResultRenderer({ value }) {
  const config = {
    Approved: { bg: "#d1fae5", color: "#065f46" },
    Rejected: { bg: "#fee2e2", color: "#991b1b" },
    Pending:  { bg: "#fef3c7", color: "#92400e" },
  };
  const c = config[value] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, whiteSpace: "nowrap",
    }}>
      {value}
    </span>
  );
}

function ProofFileRenderer({ value }) {
  return (
    <button
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px", fontSize: 11, fontWeight: 600,
        color: "#4f46e5", background: "#eef2ff",
        border: "1px solid #c7d2fe", borderRadius: 8, cursor: "pointer",
        whiteSpace: "nowrap",
      }}
      onClick={() => alert(`Opening: ${value}`)}
    >
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      {value}
    </button>
  );
}

/* ─── Stat cards ─────────────────────────────────────────── */
const stats = [
  {
    label: "Total Applications",
    value: String(mockData.length),
    gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    label: "Approved",
    value: String(mockData.filter(r => r.result === "Approved").length),
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Pending",
    value: String(mockData.filter(r => r.result === "Pending").length),
    gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Rejected",
    value: String(mockData.filter(r => r.result === "Rejected").length),
    gradient: "linear-gradient(135deg, #fb7185, #e11d48)",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

/* ─── Column definitions ─────────────────────────────────── */
const columns = [
  { key: "appNo",          label: "APP NO"           },
  { key: "empId",          label: "EMP ID",           renderer: "empId"  },
  {
    key: "empName", label: "EMP NAME",
    render: (val) => (
      <span style={{ fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap" }}>{val}</span>
    ),
  },
  { key: "class",          label: "CLASS",            renderer: "class"  },
  { key: "gradDate",       label: "GRAD DATE"         },
  { key: "dateOfJoin",     label: "DATE OF JOIN"      },
  { key: "basic",          label: "BASIC",            renderer: "basic"  },
  { key: "dob",            label: "DATA OF BIRTH"     },
  { key: "dept",           label: "DEPT"              },
  { key: "casteId",        label: "CASTE ID"          },
  { key: "currentQtr",     label: "CURRENT QTR"       },
  { key: "currentQtyType", label: "CURRENT QTY TYPE"  },
  { key: "reqQtr",         label: "REQ QTR"           },
  { key: "reqQtrLocation", label: "REQ QTR LOCATION"  },
  { key: "reqQtrType",     label: "REQ QTR TYPE"      },
  { key: "exchange",       label: "EXCHANGE"          },
  {
    key: "proofFile", label: "PROOF FILE",
    render: (val) => <ProofFileRenderer value={val} />,
  },
  { key: "reqDate",        label: "REQ DATE"          },
  { key: "rosterNo",       label: "ROSTER NO"         },
  {
    key: "result", label: "RESULT",
    render: (val) => <ResultRenderer value={val} />,
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function StatusOfApplications() {
  return (
    <AdminLayout
      title="Status of Applications"
      subtitle="Land Data Management System — Application Tracker"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((card, i) => (
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

      {/* AG Grid Table */}
      <AgGridTable
        columns={columns}
        rows={mockData}
        title="Application Status Register"
        subtitle="PPA Committee Review Queue"
        badgeText={`${mockData.length} applications`}
        badgeLabel="Status Overview"
        searchable
        pageSize={10}
        height={500}
        showExport
        showFilter
        contentAlign="center"
      />
    </AdminLayout>
  );
}
