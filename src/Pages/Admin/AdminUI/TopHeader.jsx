import { Link } from "react-router-dom";

function HeaderButton({ to, label, icon, solid = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-[1.15rem] px-5 py-3 text-sm font-semibold transition duration-200 ${
        solid
          ? "bg-[linear-gradient(135deg,_#7c3aed,_#4f46e5)] text-white shadow-[0_16px_35px_rgba(99,62,242,0.35)] hover:brightness-105"
          : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      {label}
    </Link>
  );
}

export default function TopHeader({ title, subtitle, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/96 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-6 md:px-10">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden"
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="mozilla-text-Header text-[2rem] leading-tight text-slate-900 md:text-[2.2rem]">
              {title}
            </h1>
            <p className="mt-1 text-base text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-center">
          <HeaderButton
            to="/dashboard"
            label="Home"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3.75 7.5A2.25 2.25 0 016 5.25h4.5a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0110.5 18.75H6a2.25 2.25 0 01-2.25-2.25v-9zM12.75 9.75A2.25 2.25 0 0115 7.5h3A2.25 2.25 0 0120.25 9.75v6A2.25 2.25 0 0118 18h-3a2.25 2.25 0 01-2.25-2.25v-6z"
              />
            }
          />
          <HeaderButton
            to="/ApplyForQuarters"
            label="Apply Online"
            solid
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 4.5v15m7.5-7.5h-15"
              />
            }
          />
        </div>
      </div>
    </header>
  );
}
