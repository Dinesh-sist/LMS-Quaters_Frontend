import { Link } from "react-router-dom";
import AdminSideNav from "./AdminSideNav";

export default function AdminSidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={`flex h-full flex-col overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(154,92,255,0.35),_transparent_36%),linear-gradient(180deg,_#5a32de_0%,_#6e2ce3_45%,_#5520b7_100%)] text-white ${
        mobile ? "w-[88vw] max-w-[340px]" : "w-[314px]"
      }`}
    >
      <div className="border-b border-white/10 px-6 py-7">
        <Link to="/dashboard" onClick={onNavigate} className="block">
          <p className="mozilla-text-Header text-[2rem] leading-none tracking-tight">
            Paradip Port
          </p>
          <p className="mt-1 text-lg font-medium text-white/88">Authority</p>
        </Link>
      </div>

      <div className="flex-1 px-4 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/58">
          PPA Login Menu
        </p>
        <h2 className="mt-3 text-[1.7rem] font-semibold leading-tight text-white">
          Admin Modules
        </h2>

        <div className="mt-8">
          <AdminSideNav onNavigate={onNavigate} />
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="flex items-center gap-3 rounded-[1.5rem] bg-white/7 px-4 py-4 backdrop-blur-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/18 text-xl font-bold">
            A
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold leading-5 text-white">
              Admin
            </p>
            <p className="mt-1 truncate text-sm text-white/72">Super User</p>
          </div>

          <Link
            to="/StaffLogin"
            onClick={onNavigate}
            aria-label="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/72 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h10.5m0 0l-3.75-3.75M20.25 12l-3.75 3.75"
              />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
