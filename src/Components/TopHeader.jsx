import { useEffect, useState } from "react";
import Brand from "./Brand";
import Info from "./Info";
import TranslateButton from "./TranslateButton";

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


function FontSizeControls({ onDecrease, onIncrease }) {
  return (
    <div
      className="inline-flex items-center gap-1"
      role="group"
      aria-label="Font size controls"
    >
      <button
        type="button"
        onClick={onDecrease}
        className="rounded-lg border border-white/85 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:border-orange-300 hover:text-[#fb923c] lg:text-[8px]"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        A-
      </button>
    
      <button
        type="button"
        onClick={onIncrease}
        className="rounded-lg border border-white/85 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:border-orange-300 hover:text-[#fb923c] lg:text-[8px]"
        aria-label="Increase font size"
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
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

  const [fontSize, setFontSize] = useState(16);

  const increase = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const decrease = () => setFontSize((prev) => Math.max(prev - 2, 12));

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1f44] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:flex-nowrap lg:gap-3 lg:px-5 xl:gap-4 xl:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {typeof onOpenMenu === "function" && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
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

        <div className="flex flex-nowrap items-center justify-end gap-2 sm:gap-3 lg:shrink-0">
          <FontSizeControls onDecrease={decrease} onIncrease={increase} />
          <TranslateButton />
          <span className="hidden min-w-0 text-sm text-white sm:block">
            Welcome{" "}
            <span className="tinos-regular inline-block max-w-[36vw] truncate align-bottom text-[18px] font-semibold text-orange-400 lg:max-w-[31vw] lg:text-[16px] 2xl:max-w-none">
              {displayName}
            </span>
          </span>
          <div className="hidden h-7 w-px bg-white/20 lg:block" />
          <Info
            initial={initials}
            role={roleKey}
            description={description || displayName}
            showNotifications={showNotifications}
            notifications={notifications}
            logoutTo={logoutTo}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
