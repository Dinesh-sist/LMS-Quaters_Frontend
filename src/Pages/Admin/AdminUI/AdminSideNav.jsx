import { Link, useLocation } from "react-router-dom";

const sidebarNav = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),


  },
  {
    key: "verify",
    label: "Verify Quarter Applications",
    to: "/admin/verify",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    key: "status",
    label: "Status of Applications",
    to: "/admin/status",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 17v-6m4 6V7m4 10V4M5 19h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1z" />
      </svg>
    ),
  },
  {
    key: "history",
    label: "History of Allotment Committee",
    to: "/admin/history",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </svg>
    ),
  },
];

export default function AdminSideNav({ onNavigate }) {
  const location = useLocation();




  return (
    <aside className="h-full w-[252px] shrink-0 bg-white flex flex-col overflow-hidden border-r border-[#dde3ee]">
      <div className="px-5 pt-[22px] pb-[15px] text-[13px] font-bold text-slate-500 uppercase tracking-[0.5px]">
        Admin Management
      </div>


      <nav className="px-2.5 flex-1">
        {sidebarNav.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-[11px] px-[13px] py-2.5 rounded-lg mb-[3px] no-underline text-[13.5px] transition-all duration-150 ${
                active
                  ? "font-semibold text-[#e87722] bg-[rgba(232,119,34,0.09)]"
                  : "font-medium text-gray-700 bg-transparent hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
