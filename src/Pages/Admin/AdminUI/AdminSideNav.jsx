import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Users,
  CalendarClock,
  UserCog,
  HousePlus,
  UserPlus,
} from "lucide-react";


const sidebarNav = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/admin/dashboard",
//     icon: (
//       <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//         <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     ),
    icon: <LayoutDashboard size={17} strokeWidth={1.8} />,
  },
  {
    key: "verify",
    label: "Verify Quarter Applications",
    to: "/admin/verify",
    icon: <ClipboardCheck size={17} strokeWidth={1.8} />,
  },
  {
    key: "status",
    label: "Status of Applications",
    to: "/admin/status",
    icon: <BarChart3 size={17} strokeWidth={1.8} />,
  },
  {
    key: "history",
    label: "History of Allotment Committee",
    to: "/admin/history",
    icon: <Users size={17} strokeWidth={1.8} />,
  },
  {
    key: "Date",
    label: "Set date for application",
    to: "/admin/date",
    icon: <CalendarClock size={17} strokeWidth={1.8} />,
  },
  {
    key: "map",
    label: "Map View of Quarters",
    to: "/admin/map",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>
        <path d="M15 5.764v15"/>
        <path d="M9 3.236v15"/>
      </svg>
    ),
  },
  {
    key: "ClassUpdation",
    label: "Employee Class Updation",
    to: "/admin/classupdation",
    icon: <UserCog size={17} strokeWidth={1.8} />,
  },
  {
    key: "UpdateStatus",
    label: "Update Status of Quarters",
    to: "/admin/quartersupdation",
    icon: <HousePlus size={17} strokeWidth={1.8} />,
  },
  {
    key: "EmployeeRegistration",
    label: "Employee Registration",
    to: "/admin/employeeregistration",
    icon: <UserPlus size={17} strokeWidth={1.8} />,
  }
];

function getStoredCollapsed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("adminSidebarCollapsed") === "true";
}

export default function AdminSideNav({ onNavigate, forceExpanded = false }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(getStoredCollapsed);
  const isCollapsed = forceExpanded ? false : collapsed;

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("adminSidebarCollapsed", String(next));
      }
      return next;
    });
  };

  return (
    <aside
      className={`h-full shrink-0 bg-white flex flex-col overflow-visible border-r border-[#dde3ee] transition-[width] duration-200 ${
        isCollapsed ? "w-[76px]" : "w-[252px]"
      }`}
    >
      <div className={`flex items-center px-3 pt-[18px] pb-[15px] ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed ? (
          <div className="text-[13px] font-bold text-slate-500 uppercase tracking-[0.5px]">
            Admin Management
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

      <nav className="px-2.5 flex-1">
        {sidebarNav.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={onNavigate}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex items-center ${isCollapsed ? "justify-center px-0" : "gap-[11px] px-[13px]"} py-2.5 rounded-lg mb-[3px] no-underline text-[13.5px] transition-all duration-150 ${
                active
                  ? "font-medium text-[#e87722] bg-[rgba(232,119,34,0.09)]"
                  : "font-medium text-gray-700 bg-transparent hover:bg-slate-100 hover:text-slate-800"
              }`}
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
    </aside>
  );
}