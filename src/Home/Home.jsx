import { Link } from "react-router-dom";

import TopNavbar from "./UI/TopNavbar";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 relative overflow-hidden">
      <div
        className="relative bg-white flex flex-col"
        style={{ width: "100vw", height: "100vh" }}
      >
        <TopNavbar />

        {/* ── HERO ── */}
        <main className="flex-1 flex items-center justify-center px-18 py-6">

          {/* LEFT: Text */}
          <section className="flex flex-col gap-4 mb-10">
            <h2 className="mozilla-text-Header text-[55px] font-extrabold leading-tight text-blue-950">
              Land Management System
            </h2>

            <p className="m-0 text-sm leading-relaxed text-[#64748b] max-w-[400px]">
              A unified land data management portal for vacancy discovery, online applications, and estate administration.
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/QuartersApplyLogin"
                className="text-sm font-medium rounded-full px-5 py-2.5 no-underline bg-orange-400 text-white hover:bg-orange-500 transition-colors shadow-[0_6px_20px_rgba(232,119,34,0.35)]"
              >
                Apply Quarters
              </Link>
              <Link
                to="/StaffLogin"
                className="text-sm font-medium rounded-full px-5 py-2.5 no-underline bg-blue-950 text-white hover:bg-[#2b4a8f] transition-colors"
              >
                Staff Login
              </Link>
            </div>

          </section>

        </main>
      </div>
    </div>
  );
}
