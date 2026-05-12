import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/Logo.png";

const NAV_ITEMS = [
  { label: "Home",         to: "/",           dropdown: false },
  { label: "About",        to: "/about",      dropdown: false },
  { label: "Dashboard",    to: "/dashboard",  dropdown: false },
  { label: "Apply Online", to: null,          dropdown: true  },
  { label: "Staff Login",  to: "/StaffLogin", dropdown: false },
];

const DROPDOWN_ITEMS = [
  { label: "Quarters", to: "/QuartersApplyLogin", active: true  },
  { label: "Market",   to: null,                  active: false },
  { label: "Lease",    to: null,                  active: false },
  { label: "Licence",  to: null,                  active: false },
];

export default function TopNavbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine if the current path is one of the dropdown destinations
  const dropdownPaths = DROPDOWN_ITEMS.filter(i => i.to).map(i => i.to);
  const isDropdownActive = dropdownPaths.includes(location.pathname);

  return (
    <header className="flex items-center justify-between px-10 py-6">

      {/* LEFT — Logo + Title */}
      <div className="flex items-center gap-3 shrink-0">
        <img src={Logo} alt="Logo" className="w-14 rounded-2xl" />
        <div className="flex flex-col leading-tight">
          <span className="overlock-sc-regular text-[25px] text-base font-bold text-blue-950 leading-none">
            Paradip Port Authority
          </span>
        </div>
      </div>

      {/* CENTER — Pill nav */}
      <nav className="flex items-center bg-white rounded-full px-2 py-1.5 shadow-sm border border-[#e2e8f0] gap-1">
        {NAV_ITEMS.map(({ label, to, dropdown }) => {

          // ── Dropdown button ──
          if (dropdown) {
            return (
              <div key={label} className="relative">
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full transition-all cursor-pointer border-0 ${
                    isDropdownActive || dropdownOpen
                      ? "bg-orange-400 text-white"
                      : "bg-transparent text-slate-700 hover:bg-orange-100"
                  }`}
                >
                  {label}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 bg-[#1a2e5a] rounded-2xl py-3 px-2 shadow-xl z-50 min-w-[160px]">
                    {DROPDOWN_ITEMS.map(({ label: dl, to: dto, active }) =>
                      active && dto ? (
                        <Link
                          key={dl}
                          to={dto}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/10 rounded-xl transition-colors"
                        >
                          {dl}
                        </Link>
                      ) : (
                        <span
                          key={dl}
                          className="block px-4 py-2 text-sm text-slate-400 cursor-not-allowed italic rounded-xl"
                        >
                          {dl}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          }

          // ── Regular link ──
          // Active only when pathname matches exactly (not when dropdown path is active)
          const isActive = location.pathname === to && !isDropdownActive;

          return (
            <Link
              key={label}
              to={to}
              onClick={() => setDropdownOpen(false)}
              className={`text-sm font-semibold px-5 py-2 rounded-full no-underline transition-all ${
                isActive
                  ? "bg-orange-400 text-white"
                  : "text-slate-700 hover:bg-orange-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT — Contact button */}

    </header>
  );
}
