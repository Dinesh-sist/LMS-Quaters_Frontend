import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Logout from "./Logout";
import TranslateButton from "./TranslateButton";

export default function Info({
  initial,
  role,
  description,
  collapsed = false,
  showNotifications = true,
  notifications,
  logoutTo,
  onLogout,
  onDecreaseFont,
  onIncreaseFont,
  onResetFont,
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
    user: "Registered Employee",
    newuser: "Registered Employee",  
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

          {/* Preferences card: Language & Font size */}
          <div className="mx-2.5 my-1.5 flex flex-col gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5">
            {/* Language Switch */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-600">Language</span>
              <TranslateButton className="!px-2.5 !py-1 !text-xs !rounded-lg !border-slate-200 !shadow-none hover:!bg-orange-50 hover:!text-orange-600 hover:!border-orange-200" />
            </div>

            {/* Font size adjustment */}
            {(onDecreaseFont || onIncreaseFont || onResetFont) && (
              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span className="text-[12px] font-semibold text-slate-600">Text Size</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onDecreaseFont}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 active:scale-95 cursor-pointer"
                    aria-label="Decrease font size"
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={onResetFont}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 active:scale-95 cursor-pointer"
                    aria-label="Reset font size"
                    title="Reset font size"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={onIncreaseFont}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 active:scale-95 cursor-pointer"
                    aria-label="Increase font size"
                    title="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>
            )}
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
