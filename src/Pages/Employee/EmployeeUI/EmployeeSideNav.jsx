import { Link, useLocation, useNavigate } from "react-router-dom";

const sidebarNav = [
  {
    key: "apply",
    label: "Apply for Quarters",
    to: "/Quarters/Apply",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    key: "applyEmp",
    label: "Apply Quarters for Employees",
    to: "/Quarters/ApplyEmployees",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    key: "approval",
    label: "Check Approval",
    to: "/Quarters/Approval",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    key: "demand",
    label: "Demand Note",
    to: "/Quarters/DemandNote",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M15 17H9m3-4H9m3-4H9M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (location.pathname === "/Quarters/Apply") return;
    navigate("/Quarters/Apply");
    onNavigate?.();
  };


  return (
    <aside className="w-[252px] shrink-0 bg-white flex flex-col overflow-hidden border-r border-[#dde3ee]">

        {/* Meta label */}
        <div className="px-5 pt-[22px] pb-[5px] text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em]">
          PPT Outsiders Menu
        </div>

        {/* Section heading */}
        <div className="px-5 pt-1 pb-4 text-sm font-bold text-slate-800">
          Outsider Services
        </div>

        {/* Nav items */}
        <nav className="px-2.5 flex-1">
          {sidebarNav.map((item) => {
            const active =
              item.key === "apply"
                ? location.pathname === "/Quarters/Apply"
                : item.key === "applyEmp"
                  ? location.pathname === "/Quarters/ApplyEmployees"
                : location.pathname === item.to;

            const className = `flex w-full items-center gap-[11px] px-[13px] py-2.5 rounded-lg mb-[3px] no-underline text-[13.5px] text-left transition-all duration-150 ${
              active
                ? "font-semibold text-[#e87722] bg-[rgba(232,119,34,0.09)]"
                : "font-medium text-gray-700 bg-transparent hover:bg-slate-100 hover:text-slate-800"
            }`;

            if (item.key === "apply") {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={handleApplyClick}
                  className={className}
                >
                  <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.to}
                onClick={onNavigate}
                className={className}
              >
                <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[#e9eef4] mx-4 my-1" />

        {/* Need Help box */}
        <div className="mx-3 mb-4 rounded-[10px] bg-slate-50 border border-[#e2e8f0] px-4 py-3.5">
          <div className="text-[13px] font-bold text-slate-800 mb-1">Need Help?</div>
          <div className="text-[11.5px] text-slate-500 leading-[1.55] mb-2.5">
            Contact our support team for assistance
          </div>

          <div className="flex items-center gap-1.5 text-[11.5px] text-slate-600 mb-[5px]">
            <svg width="13" height="13" fill="none" stroke="#e87722" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2.08 5.18 2 2 0 0 1 4.11 3h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 17.92z" />
            </svg>
            1800-111-XXXX
          </div>

          <div className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
            <svg width="13" height="13" fill="none" stroke="#e87722" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            support@ppa.gov.in
          </div>
        </div>
      </aside>
  );
}
