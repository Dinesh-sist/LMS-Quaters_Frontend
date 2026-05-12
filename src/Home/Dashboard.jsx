import TopNavbar from "./UI/TopNavbar";

const STAT_CARDS = [
  { label: "Total Quarters", value: "152", icon: "🏘️", color: "bg-blue-100 text-blue-950" },
  { label: "Vacant Units",   value: "48",  icon: "🔑", color: "bg-orange-100 text-orange-600" },
  { label: "Applications",   value: "—",   icon: "📋", color: "bg-slate-100 text-slate-400" },
  { label: "Pending Review", value: "—",   icon: "⏳", color: "bg-slate-100 text-slate-400" },
];

const SKELETON_ROWS = Array.from({ length: 5 });

export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 relative overflow-hidden">
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animated {
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
      `}</style>
      <div className="gradient-animated absolute inset-0 -z-10" />
      <div
        className="relative bg-blue-50 rounded-3xl flex flex-col border border-[#e2e8f0] shadow-2xl"
        style={{ width: "85vw", height: "calc(85vh - 80px)" }}
      >
        <TopNavbar />

        <main className="flex-1 flex flex-col gap-6 px-8 py-6">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="modern-antiqua-regular m-0 text-2xl font-extrabold text-blue-950">
                Dashboard
              </h1>
              <p className="m-0 mt-1 text-xs text-slate-400">
                Estate overview & analytics — full data coming soon
              </p>
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-400 bg-orange-50 border border-orange-200 rounded-full px-4 py-1">
              Under Development
            </span>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {STAT_CARDS.map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] flex flex-col gap-2 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-lg`}>
                  {icon}
                </div>
                <p className="m-0 text-2xl font-extrabold text-blue-950">{value}</p>
                <p className="m-0 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Skeleton Table */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <p className="m-0 text-sm font-semibold text-blue-950">Recent Applications</p>
              <span className="text-xs text-slate-400">Live data unavailable</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-5 px-6 py-3 bg-slate-50 border-b border-[#e2e8f0]">
              {["Applicant", "Quarter No.", "Type", "Submitted", "Status"].map(h => (
                <p key={h} className="m-0 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
              ))}
            </div>

            {/* Skeleton rows */}
            {SKELETON_ROWS.map((_, i) => (
              <div key={i} className="grid grid-cols-5 px-6 py-4 border-b border-[#f1f5f9] items-center">
                {Array.from({ length: 5 }).map((__, j) => (
                  <div
                    key={j}
                    className="h-3 rounded-full bg-slate-100 animate-pulse"
                    style={{ width: `${55 + Math.random() * 35}%`, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Bottom notice */}
          <div className="flex items-center gap-3 bg-blue-950 text-white rounded-2xl px-6 py-4 mt-auto shadow-lg">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#f97316" strokeWidth="1.5" />
              <path d="M9 5v5M9 12v.5" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p className="m-0 text-sm">
              The dashboard is currently being built. Analytics, charts, and live estate data will appear here once complete.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
