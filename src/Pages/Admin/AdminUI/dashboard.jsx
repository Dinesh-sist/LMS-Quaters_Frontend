import AdminLayout from "./AdminLayout";

const stats = [
  {
    label: "Records",
    value: "1,714",
    accent: "bg-amber-200 text-amber-700",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M7 3.75h6.5L19 9.25V20a1.25 1.25 0 0 1-1.25 1.25h-10.5A1.25 1.25 0 0 1 6 20V5A1.25 1.25 0 0 1 7.25 3.75z" />
        <path d="M13 3.75V9.5h5.75" />
      </svg>
    ),
  },
  {
    label: "Open Files",
    value: "17",
    accent: "bg-sky-200 text-sky-700",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.293c.398 0 .779.158 1.06.44l1.707 1.706c.281.282.662.44 1.06.44H18A2.25 2.25 0 0 1 20.25 9.33v7.92A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75z" />
      </svg>
    ),
  },
  {
    label: "Vacant Quarters / Plots",
    value: "14",
    accent: "bg-rose-200 text-rose-700",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4.5 19.5h15M6 19.5V9.75l6-4.5 6 4.5v9.75M9.75 19.5v-4.875h4.5V19.5" />
      </svg>
    ),
  },
  {
    label: "Notices",
    value: "8",
    accent: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.25 17.25H5.625A1.875 1.875 0 0 1 3.75 15.375V11.25a5.625 5.625 0 1 1 11.25 0v4.125a1.875 1.875 0 0 1-.75 1.5z" />
        <path d="M9.375 20.25a2.625 2.625 0 0 0 5.25 0" />
        <path d="M15 17.25h3.375A1.875 1.875 0 0 0 20.25 15.375V11.25" />
      </svg>
    ),
  },
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

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action ? <span className="text-xs font-medium text-slate-400">{action}</span> : null}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="A quick overview of quarter management activity, requests, and notices."
    >
 
      

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                    {item.value}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${item.accent}`}>{item.icon}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <SectionCard title="Latest Requests" action="Current cycle">
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[request.status]
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td
                        className={`px-2 py-3 font-medium ${
                          request.stage === "Active" ? "text-emerald-700" : "text-slate-500"
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

          <SectionCard title="Server Notices">
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
          <SectionCard title="Land Usage Overview">
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
          
          <SectionCard title="Recent Activity">
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
