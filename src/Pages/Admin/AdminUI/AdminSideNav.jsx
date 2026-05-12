import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Verify Quarter Applications",
    shortLabel: "Verify Quarter Applications",
    to: "/admin/verify",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    label: "Status of Applications",
    shortLabel: "Status of Applications",
    to: "/admin/status",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 17v-6m4 6V7m4 10V4M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
      />
    ),
  },
  {
    label: "History Of House Allotment Committee",
    shortLabel: "History Of House Allotment Committee",
    to: "/admin/history",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
];

export default function AdminSideNav({ onNavigate }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-3">
      {navItems.map((item) => {
        const active = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`group flex items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-200 ${
              active
                ? "border-white/10 bg-white/18 text-white shadow-[0_20px_45px_rgba(33,14,94,0.3)] backdrop-blur-sm"
                : "border-transparent bg-white/0 text-white/82 hover:border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                active ? "bg-white/14" : "bg-white/8 group-hover:bg-white/12"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
            </span>

            <span className="flex min-w-0 flex-col">
              <span className="text-[1.02rem] font-semibold leading-6">
                {item.shortLabel}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
