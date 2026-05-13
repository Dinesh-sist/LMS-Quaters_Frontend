import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Logout from "./Logout";

export default function Info({
  initial,
  role,
  description,
  collapsed = false,
  showNotifications = true,
  notifications,
  logoutTo,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const roleKey = String(role || "user").toLowerCase();
  const roleStyles = {
    admin: "text-red-600",
    manager: "text-amber-600",
    user: "text-green-700",
    newuser: "text-indigo-700",
  };

  const roleLabels = {
    admin: "Authorized Admin",
    manager: "Authorized Manager",
    user: "Registered User",
    newuser: "Temporary User",
  };

  const roleColor = roleStyles[roleKey] || roleStyles.user;
  const notificationCount = useMemo(
    () => (Array.isArray(notifications) ? notifications.length : 0),
    [notifications]
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 rounded-xl border border-transparent px-2 py-1.5 max-sm:px-0 max-sm:py-0"
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white shadow-sm lg:h-9 lg:w-9">
          {initial}
          {showNotifications && notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 lg:h-3 lg:w-3" />
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[99999] mt-2 w-[20rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-gray-200 bg-white py-2 shadow-xl">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className={`text-[10px] font-medium uppercase tracking-wider ${roleColor}`}>
              {roleLabels[roleKey] || roleLabels.user}
            </p>
            <p className="tinos-regular truncate text-sm font-semibold text-gray-800">
              {description || "..."}
            </p>
          </div>

          <div className="mt-1 px-2.5">
            <Logout
              showNotifications={showNotifications}
              notifications={notifications}
              role={roleKey}
              logoutTo={logoutTo}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
}
