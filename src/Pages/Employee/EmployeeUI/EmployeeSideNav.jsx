import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const sidebarNav = [
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
    label: "Check Status of applications",
    to: "/Quarters/Approval",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
   
];


function getStoredCollapsed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("employeeSidebarCollapsed") === "true";
}

export default function Sidebar({ onNavigate, forceExpanded = false }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(getStoredCollapsed);
  const isCollapsed = forceExpanded ? false : collapsed;

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("employeeSidebarCollapsed", String(next));
      }
      return next;
    });
  };

  return (
    <aside
      className={`shrink-0 bg-white flex flex-col overflow-visible border-r border-[#dde3ee] transition-[width] duration-200 ${
        isCollapsed ? "w-[76px]" : "w-[252px]"
      }`}
    >

        {/* Meta label */}
        <div className={`flex items-center px-3 pt-[18px] pb-2 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed ? (
            <div className="text-[13px] font-bold text-blue-900 uppercase tracking-[0.5px]">
              EMPLOYEE MANAGEMENT
            </div>
          ) : null}
          {!forceExpanded ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#e87722]"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
          ) : null}
        </div>

        {/* Section heading */}

        {/* Nav items */}
        <nav className="px-2.5 flex-1">
          {sidebarNav.map((item) => {
            const active =
              item.key === "applyEmp"
                ? location.pathname === "/Quarters/ApplyEmployees"
                : location.pathname === item.to;

            const className = `group relative flex w-full items-center ${isCollapsed ? "justify-center px-0" : "gap-[11px] px-[13px]"} py-2.5 rounded-lg mb-[3px] no-underline text-[13.5px] text-left transition-all duration-150 ${              
              active
          
                ? "font-medium text-[#e87722] bg-[rgba(232,119,34,0.09)]"
                : "font-medium text-gray-700 bg-transparent hover:bg-slate-100 hover:text-slate-800"
            }`;

            return (
              <Link
                key={item.key}
                to={item.to}
                onClick={onNavigate}
                title={isCollapsed ? item.label : undefined}
                className={className}
              >
                <span className={`flex items-center shrink-0 ${active ? "text-[#e87722]" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {!isCollapsed ? item.label : null}
                {isCollapsed ? (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        
      </aside>
  );
}
