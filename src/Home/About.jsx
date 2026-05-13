import TopNavbar from "./UI/TopNavbar";

export default function About() {

  return (
    <div className="relative h-screen w-full overflow-hidden">
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
      <div className="relative h-full w-full overflow-hidden">
        <div className="relative z-10 flex h-full flex-col">
          <TopNavbar titleColor="text-white" />

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
              <h1 className="modern-antiqua-regular text-[2.2rem] font-extrabold text-white text-center leading-tight m-0">
                About Paradip Port<br />Authority
              </h1>

              {/* Description */}


              {/* Progress bar */}


            </div>

            {/* Floating bottom note */}
            <div className="flex items-center gap-2 bg-blue-950 text-white rounded-2xl px-5 py-3 text-xs font-medium shadow-lg">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#f97316" strokeWidth="1.5" />
                <path d="M7 4v4M7 10v.5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Check back soon
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
