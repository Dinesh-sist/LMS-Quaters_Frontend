import { useEffect, useState } from "react";
import Brand from "./Brand";
import Info from "./Info";

function getRoleLabel(roleKey) {
  switch (roleKey) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "newuser":
      return "New User";
    default:
      return "User";
  }
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "U";
  return parts.map((part) => part[0]).join("").toUpperCase();
}


export default function TopHeader({
  initial,
  role = "user",
  description,
  welcomeName,
  showNotifications = true,
  notifications,
  logoutTo,
  onLogout,
  onOpenMenu,
}) {
  const roleKey = String(role || "user").toLowerCase();
  const displayName = welcomeName || description || getRoleLabel(roleKey);
  const initials = initial || getInitials(displayName);

  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize") || "16");
  });

  const increase = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const decrease = () => setFontSize((prev) => Math.max(prev - 2, 12));
  const reset = () => setFontSize(16);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1f44] shadow-sm">
      <div className="flex min-h-[58px] sm:min-h-[76px] flex-nowrap items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-4 lg:gap-3 lg:px-8 xl:gap-4 xl:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {typeof onOpenMenu === "function" && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}
          <Brand />
        </div>

        <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden min-w-0 items-baseline text-sm font-medium text-white sm:flex gap-1.5">
            <span>Welcome</span>
            <span className="max-w-[36vw] truncate text-[16px] font-bold text-orange-400 lg:max-w-[31vw] lg:text-[24px] 2xl:max-w-none">
              {displayName}
            </span>
          </div>
          <div className="hidden h-7 w-px bg-white/20 lg:block" />
          <Info
            initial={initials}
            role={roleKey}
            welcomeName={displayName}
            description={description || displayName}
            showNotifications={showNotifications}
            notifications={notifications}
            logoutTo={logoutTo}
            onLogout={onLogout}
            onDecreaseFont={decrease}
            onIncreaseFont={increase}
            onResetFont={reset}
          />
        </div>
      </div>
    </header>
  );
}
