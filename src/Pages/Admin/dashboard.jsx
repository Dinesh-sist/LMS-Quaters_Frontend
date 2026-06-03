import { useEffect, useState } from "react";
import AdminLayout from "./AdminUI/AdminLayout";
import { Files, HouseHeart, HousePlus, Users } from "lucide-react";
import { request } from "../../api";

const stats = [
  {
    label: "Total Number of Quarters",
    value: "1,714",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-amber-300/70 bg-gradient-to-br from-amber-600 via-orange-400 to-amber-400",
    hoverBg: "bg-gradient-to-br from-amber-700 via-orange-500 to-yellow-300",
    valueColor: "text-white",
    icon: <HouseHeart size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of Occupied Quarters",
    value: "17",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-sky-300/70 bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-400",
    hoverBg: "bg-gradient-to-br from-blue-800 via-sky-600 to-cyan-200",
    valueColor: "text-white",

    icon: <Users size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of Vacant Quarters",
    value: "14",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-emerald-300/70 bg-gradient-to-br from-teal-700 via-emerald-500 to-lime-400",
    hoverBg: "bg-gradient-to-br from-teal-800 via-emerald-600 to-lime-200",
    valueColor: "text-white",

    icon: <HousePlus size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of quaters beyond repair",
    value: "8",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-rose-300/70 bg-gradient-to-br from-red-700 via-rose-500 to-pink-400",
    hoverBg: "bg-gradient-to-br from-red-800 via-rose-600 to-pink-200",
    valueColor: "text-white",
    icon: <Files size={20} strokeWidth={1.8} />,
  }
];

const requests = [
  { id: 3095, fileNo: "22005", module: "Allotment", status: "Review", stage: "Pending" },
  { id: 3335, fileNo: "22025", module: "Renewal", status: "Scrutiny", stage: "Pending" },
  { id: 5535, fileNo: "22045", module: "Lease", status: "Approval", stage: "Active" },
];

const statusClasses = {
  Review: "bg-sky-100 text-sky-800",
  Scrutiny: "bg-amber-100 text-amber-800",
  Approval: "bg-emerald-100 text-emerald-800",
};

const notices = [
  "Site resettlement update released",
  "Culture and labour unit circular published",
  "Corridor maintenance notice issued",
];

const activities = [
  "Estate officer updated new vacancy records for internal review.",
  "Proposal review moved to the scrutiny stage for committee action.",
  "Latest allotment document uploaded to the current request record.",
];

const landData = [
  { label: "Industrial", value: 35, color: "#378ADD" },
  { label: "Housing", value: 25, color: "#7F77DD" },
  { label: "Utilities", value: 18, color: "#EF9F27" },
  { label: "Reserve", value: 14, color: "#1D9E75" },
  { label: "Other", value: 8, color: "#888780" },
];

const landChartBackground = `conic-gradient(${landData
  .map((item, index) => {
    const start = landData.slice(0, index).reduce((sum, entry) => sum + entry.value, 0);
    const end = start + item.value;
    return `${item.color} ${start}% ${end}%`;
  })
  .join(", ")})`;

function SectionCard({ title, action, delay = 0, children }) {
  return (
    <section
      className="lms-card-land rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action ? <span className="text-xs font-medium text-slate-400">{action}</span> : null}
      </div>
      {children}
    </section>
  );
}
export default function AdminDashboard() {
  const [totalQuarters, setTotalQuarters] = useState("...");
  const [quarterCounts, setQuarterCounts] = useState({
    occupied: "...",
    vacant: "...",
    beyondRepair: "...",
  });

  useEffect(() => {
    async function loadTotalQuarters() {
      try {
        const data = await request("/api/estate-quarters/total-count", {
          auth: true,
        });

        setTotalQuarters(Number(data.total || 0).toLocaleString("en-IN"));
      } catch (err) {
        console.error("Total quarters count error:", err);
        setTotalQuarters("0");
      }
    }

    loadTotalQuarters();
    async function loadQuarterStatusCounts() {
      try {
        const data = await request("/api/estate-quarters/status-counts", {
          auth: true,
        });

        setQuarterCounts({
          occupied: Number(data.occupied || 0).toLocaleString("en-IN"),
          vacant: Number(data.vacant || 0).toLocaleString("en-IN"),
          beyondRepair: Number(data.beyondRepair || 0).toLocaleString("en-IN"),
        });
      } catch (err) {
        console.error("Quarter status counts error:", err);
      }
    }

    loadQuarterStatusCounts();
  }, []);

  const dashboardStats = stats.map((item) => {
    if (item.label === "Total Number of Quarters") {
      return { ...item, value: totalQuarters };
    }

    if (item.label === "Number of Occupied Quarters") {
      return { ...item, value: quarterCounts.occupied };
    }

    if (item.label === "Number of Vacant Quarters") {
      return { ...item, value: quarterCounts.vacant };
    }

    if (item.label === "Number of quaters beyond repair") {
      return { ...item, value: quarterCounts.beyondRepair };
    }

    return item;
  });

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="A quick overview of quarter management activity, requests, and notices."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item, index) => (
          <div
            key={item.label}
            className={`lms-card-land group relative overflow-hidden rounded-3xl border p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.18)] ${item.cardBg}`} style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 ${item.hoverBg}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_34%)] transition-opacity duration-500 ease-out group-hover:opacity-90" />
            <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-500 ease-out group-hover:bg-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  {item.label}
                </p>
                <p className={`mt-4 text-3xl font-semibold tracking-tight ${item.valueColor}`}>
                  {item.value}
                </p>
              </div>
              <div className={`rounded-2xl p-3 ${item.accent}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <SectionCard title="Latest Requests" action="Current cycle" delay={380}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-2 py-3 font-semibold">ID</th>
                  <th className="px-2 py-3 font-semibold">File No.</th>
                  <th className="px-2 py-3 font-semibold">Module</th>
                  <th className="px-2 py-3 font-semibold">Status</th>
                  <th className="px-2 py-3 font-semibold">Stage</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-2 py-3 text-slate-700">{request.id}</td>
                    <td className="px-2 py-3 font-medium text-slate-900">{request.fileNo}</td>
                    <td className="px-2 py-3 text-slate-700">{request.module}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[request.status]
                          }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td
                      className={`px-2 py-3 font-medium ${request.stage === "Active" ? "text-emerald-700" : "text-slate-500"
                        }`}
                    >

                      {request.stage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Server Notices" delay={470}>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 5.25v6.75l4.5 2.25" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{notice}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Latest internal update shared for department awareness.
                  </p>
                </div>
                <span className="text-xs text-slate-400">11h ago</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <SectionCard title="Land Usage Overview" delay={560}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative mx-auto h-40 w-40 shrink-0">
              <div
                className="h-full w-full rounded-full"
                style={{ background: landChartBackground }}
                aria-hidden="true"
              />
              <div className="absolute inset-[22px] flex items-center justify-center rounded-full bg-white text-center shadow-inner">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">PPA</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">Land</p>
                </div>
              </div>
            </div>
            <div className="grid flex-1 gap-3">
              {landData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" delay={650}>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    {index + 1}
                  </div>
                  {index !== activities.length - 1 ? (
                    <div className="mt-2 h-full w-px bg-slate-200" />
                  ) : null}
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium leading-6 text-slate-900">{activity}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Most recent action captured within the current workflow timeline.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

    </AdminLayout>
  );
}
