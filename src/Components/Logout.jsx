import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

const SAMPLE_NOTIFICATIONS = {
  admin: [
    {
      id: "admin-1",
      title: "Applications ready for review",
      message: "Five new quarter applications are awaiting verification.",
      category: "Approvals",
      type: "admin",
      meta: "Updated just now",
    },
    {
      id: "admin-2",
      title: "Committee history updated",
      message: "Latest allotment committee files have been added to the archive.",
      category: "Records",
      type: "admin",
      meta: "Updated today",
    },
  ],
  user: [
    {
      id: "user-1",
      title: "Application submitted",
      message: "Your quarter request has been submitted successfully.",
      category: "Application",
      type: "user",
      meta: "Updated today",
    },
  ],
  newuser: [
    {
      id: "newuser-1",
      title: "Profile setup pending",
      message: "Complete your application details before final submission.",
      category: "Profile",
      type: "user",
      meta: "Updated today",
    },
  ],
};

export default function Logout({
  showNotifications = true,
  notifications,
  role = "user",
  logoutTo,
  onLogout,
}) {
  const navigate = useNavigate();
  const roleKey = String(role || "user").toLowerCase();
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const items = useMemo(() => {
    if (Array.isArray(notifications)) return notifications;
    return SAMPLE_NOTIFICATIONS[roleKey] || [];
  }, [notifications, roleKey]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))],
    [items]
  );

  const filteredNotifications =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }

    navigate(
      logoutTo || (roleKey === "admin" ? "/StaffLogin" : "/QuartersApplyLogin")
    );
  };

  const handleToggleNotifications = () => {
    setActiveCategory("All");
    setShowNotificationsPanel((prev) => !prev);
  };

  return (
    <div className="space-y-2.5">
      {showNotifications && (
        <button
          type="button"
          onClick={handleToggleNotifications}
          className="flex w-full items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-sm font-medium text-indigo-700 transition-colors duration-300 hover:bg-indigo-600 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </span>
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {items.length}
          </span>
        </button>
      )}

      {showNotifications && showNotificationsPanel && (
        <div className="max-h-[24rem] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-3.5 shadow-sm">
          {items.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const count =
                    category === "All"
                      ? items.length
                      : items.filter((item) => item.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                        activeCategory === category
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-600">{item.message}</p>
                    </div>
                    <span className="inline-flex max-w-full shrink-0 whitespace-nowrap rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                      {item.category || item.type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{item.meta}</p>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-7 text-center text-sm text-gray-500">
                  No notifications available for {activeCategory}.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-7 text-center text-sm text-gray-500">
              No notifications available.
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-xl border border-red-400 bg-red-200/20 px-3.5 py-2.5 text-sm font-medium text-red-700 transition-colors duration-300 hover:bg-red-600 hover:text-white"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  );
}
