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

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {typeof onOpenMenu === "function" && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 lg:hidden"
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

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-sm text-gray-600 sm:block">
            Welcome{" "}
            <span className="tinos-regular text-[18px] font-semibold text-indigo-900 lg:text-[24px]">
              {displayName}
            </span>
          </span>
          <div className="hidden h-7 w-px bg-gray-200 lg:block" />
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
