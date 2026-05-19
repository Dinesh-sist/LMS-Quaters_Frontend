import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";

const mockData = [
  { id: 1, committeeHeld: "2019-11-21", downloadLink: "https://ppa.gov.in/files/committee_2019_11_21.pdf" },
  { id: 2, committeeHeld: "2020-05-30", downloadLink: "https://ppa.gov.in/files/committee_2020_05_30.pdf" },
  { id: 3, committeeHeld: "2020-07-29", downloadLink: "https://ppa.gov.in/files/committee_2020_07_29.pdf" },
  { id: 4, committeeHeld: "2021-01-22", downloadLink: "https://ppa.gov.in/files/committee_2021_01_22.pdf" },
  { id: 5, committeeHeld: "2021-04-22", downloadLink: "https://ppa.gov.in/files/committee_2021_04_22.pdf" },
  { id: 6, committeeHeld: "2021-06-24", downloadLink: "https://ppa.gov.in/files/committee_2021_06_24.pdf" },
  { id: 7, committeeHeld: "2021-07-12", downloadLink: "https://ppa.gov.in/files/committee_2021_07_12.pdf" },
  { id: 8, committeeHeld: "2021-09-05", downloadLink: "https://ppa.gov.in/files/committee_2021_09_05.pdf" },
  { id: 9, committeeHeld: "2022-01-04", downloadLink: "https://ppa.gov.in/files/committee_2022_01_04.pdf" },
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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const columns = [
  {
    key: "committeeHeld",
    header: "COMMITTEE HELD DATE",
    minWidth: 230,
    value: (row) => formatDate(row.committeeHeld),
    render: (value) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700">
        <svg
          className="h-4 w-4 shrink-0 text-[#185FA5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {value}
      </span>
    ),
  },
  {
    key: "downloadAction",
    header: "DOWNLOAD LINK",
    minWidth: 210,
    sortable: false,
    filterable: false,
    value: () => "Download File",
    render: (_value, row) => (
      <a
        href={row.downloadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5] bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#185FA5] transition-all hover:bg-[#185FA5] hover:text-white"
      >
        <svg className="h-[13px] w-[13px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download File
      </a>
    ),
  },
];

function PageSummaryBar() {
  const latestMeeting = [...mockData]
    .sort((a, b) => new Date(b.committeeHeld) - new Date(a.committeeHeld))[0];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-[180px] flex-1 text-sm font-semibold text-slate-700">
        History of House Allotment Committee
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {mockData.length} Records
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Latest: {formatDate(latestMeeting.committeeHeld)}
        </span>
      </div>
    </div>
  );
}

export default function HistoryOfHouseAllotmentCommittee() {
  return (
    <AdminLayout
      title="History Of House Allotment Committee"
      subtitle="Land Data Management System - Committee Records"
    >
      <PageSummaryBar />

      <div className="w-full overflow-x-auto rounded-xl">
        <AgGridTable
          columns={columns}
          rows={mockData}
          searchable
          pageSize={8}
          showExport
          showFilter={false}
          contentAutoWidth={false}
          contentAlign="center"
          emptyMessage="No committee records found."
          searchPlaceholder="Search committee date..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
          onClick={() => alert("Downloading Final List...")}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Final List
        </button>

        
      </div>
    </AdminLayout>
  );
}
