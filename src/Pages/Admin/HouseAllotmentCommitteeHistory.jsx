import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";

/* ─── Mock data ─────────────────────────────────────────── */
const mockData = [
  { id: 1,  committeeHeld: "2019-11-21", downloadLink: "https://ppa.gov.in/files/committee_2019_11_21.pdf" },
  { id: 2,  committeeHeld: "2020-05-30", downloadLink: "https://ppa.gov.in/files/committee_2020_05_30.pdf" },
  { id: 3,  committeeHeld: "2020-07-29", downloadLink: "https://ppa.gov.in/files/committee_2020_07_29.pdf" },
  { id: 4,  committeeHeld: "2021-01-22", downloadLink: "https://ppa.gov.in/files/committee_2021_01_22.pdf" },
  { id: 5,  committeeHeld: "2021-04-22", downloadLink: "https://ppa.gov.in/files/committee_2021_04_22.pdf" },
  { id: 6,  committeeHeld: "2021-06-24", downloadLink: "https://ppa.gov.in/files/committee_2021_06_24.pdf" },
  { id: 7,  committeeHeld: "2021-07-12", downloadLink: "https://ppa.gov.in/files/committee_2021_07_12.pdf" },
  { id: 8,  committeeHeld: "2021-09-05", downloadLink: "https://ppa.gov.in/files/committee_2021_09_05.pdf" },
  { id: 9,  committeeHeld: "2022-01-04", downloadLink: "https://ppa.gov.in/files/committee_2022_01_04.pdf" },
  { id: 10, committeeHeld: "2022-09-09", downloadLink: "https://ppa.gov.in/files/committee_2022_09_09.pdf" },
  { id: 11, committeeHeld: "2023-02-23", downloadLink: "https://ppa.gov.in/files/committee_2023_02_23.pdf" },
  { id: 12, committeeHeld: "2023-07-05", downloadLink: "https://ppa.gov.in/files/committee_2023_07_05.pdf" },
  { id: 13, committeeHeld: "2023-09-08", downloadLink: "https://ppa.gov.in/files/committee_2023_09_08.pdf" },
  { id: 14, committeeHeld: "2024-06-26", downloadLink: "https://ppa.gov.in/files/committee_2024_06_26.pdf" },
  { id: 15, committeeHeld: "2024-10-29", downloadLink: "https://ppa.gov.in/files/committee_2024_10_29.pdf" },
  { id: 16, committeeHeld: "2025-02-17", downloadLink: "https://ppa.gov.in/files/committee_2025_02_17.pdf" },
  { id: 17, committeeHeld: "2025-07-24", downloadLink: "https://ppa.gov.in/files/committee_2025_07_24.pdf" },
  { id: 18, committeeHeld: "2025-08-19", downloadLink: "https://ppa.gov.in/files/committee_2025_08_19.pdf" },
];

/* ─── Custom Download Link renderer ─────────────────────── */
function DownloadLinkRenderer({ value }) {
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 px-3 py-1 rounded-lg transition-all whitespace-nowrap"
    >
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download File
    </a>
  );
}

/* ─── Committee Date renderer ────────────────────────────── */
function CommitteeDateRenderer({ value }) {
  const date = new Date(value);
  const formatted = date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium text-xs whitespace-nowrap">
      <svg width="13" height="13" fill="none" stroke="currentColor" className="text-indigo-600" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {formatted}
    </span>
  );
}

/* ─── Stat cards ─────────────────────────────────────────── */
const currentYear = new Date().getFullYear();
// Replace the stats array:
const stats = [
  {
    label: "Total Meetings",
    value: String(mockData.length),
    color: "from-violet-600 to-indigo-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
  {
    label: `Meetings in ${currentYear}`,
    value: String(mockData.filter(r => r.committeeHeld.startsWith(String(currentYear))).length),
    color: "from-emerald-500 to-green-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
  {
    label: "Latest Meeting",
    value: "Aug 2025",
    color: "from-amber-400 to-orange-500",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Files Available",
    value: String(mockData.length),
    color: "from-rose-500 to-pink-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
];

// Replace the stat cards JSX:

/* ─── Column definitions ─────────────────────────────────── */
const columns = [
  {
    key: "committeeHeld",
    label: "COMMITTEE HELD",
    width:800,
    minWidth: 300,
    render: (val) => <CommitteeDateRenderer value={val} />,
  },
  {
    key: "downloadLink",
    label: "DOWNLOAD LINK",
    sortable: false,
    width: 800,
    minWidth: 300,
    render: (val) => <DownloadLinkRenderer value={val} />,
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function HistoryOfHouseAllotmentCommittee() {
  return (
    <AdminLayout
      title="History Of House Allotment Committee"
      subtitle="Land Data Management System — Committee Records"
    >
<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
  {stats.map((card) => (
    <div key={card.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} text-white px-5 py-4 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold leading-none">{card.value}</p>
          <p className="mt-1.5 text-xs text-white/80 font-medium leading-tight">{card.label}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.icon}</svg>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
      <div className="absolute -bottom-2 -right-1 h-9 w-9 rounded-full bg-white/10" />
    </div>
  ))}
</div>

      {/* AG Grid Table */}
      <AgGridTable
        columns={columns}
        rows={mockData}
        title="House Allotment Committee History"
        subtitle="PPA Committee Records"
        badgeText={`${mockData.length} meetings`}
        badgeLabel="Records available"
        searchable
        pageSize={10}
        showExport
        showFilter
        contentAlign="center"
      />

      {/* Download Final List button — matching the original page */}
      <div className="flex items-center gap-4 pt-2">
  <button
    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md bg-gradient-to-br from-indigo-600 to-violet-600 hover:brightness-110 transition-all active:scale-95"
    onClick={() => alert("Downloading Final List...")}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Download Final List
  </button>

  <button
    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
    onClick={() => alert("Opening Microsoft Teams...")}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    Microsoft Teams
  </button>
</div>
    </AdminLayout>
  );
}
