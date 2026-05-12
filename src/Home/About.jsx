import TopNavbar from "./UI/TopNavbar";

export default function About() {
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

        {/* Page Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 py-12 gap-8">

          {/* Decorative blueprint grid background */}
          <div className="relative flex flex-col items-center gap-6 w-full max-w-lg">

            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-blue-950 flex items-center justify-center shadow-lg">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="4" width="28" height="28" rx="4" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="18" cy="18" r="5" stroke="white" strokeWidth="2" />
                <path d="M18 8v3M18 25v3M8 18h3M25 18h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Badge */}
            <span className="text-xs font-semibold tracking-widest uppercase text-orange-400 bg-orange-50 border border-orange-200 rounded-full px-4 py-1">
              Under Development
            </span>

            {/* Heading */}
            <h1 className="modern-antiqua-regular text-[2.2rem] font-extrabold text-blue-950 text-center leading-tight m-0">
              About Paradip Port<br />Land Authority
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-500 text-center leading-relaxed m-0 max-w-md">
              This section will feature the history, mission, and vision of the Paradip Port
              Authority Land Data Management System — including leadership profiles, policy
              documents, and infrastructure overviews.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-300"
                style={{ width: "35%" }}
              />
            </div>
            <p className="text-xs text-slate-400 m-0 -mt-4">35% complete</p>

            {/* Feature pills coming soon */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["History & Vision", "Leadership Board", "Policy Documents", "Infrastructure Map", "Annual Reports"].map(tag => (
                <span key={tag} className="text-xs text-slate-500 bg-white border border-[#e2e8f0] rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Floating bottom note */}
          <div className="flex items-center gap-2 bg-blue-950 text-white rounded-2xl px-5 py-3 text-xs font-medium shadow-lg">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#f97316" strokeWidth="1.5" />
              <path d="M7 4v4M7 10v.5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Check back soon — we're building something great.
          </div>
        </main>
      </div>
    </div>
  );
}
