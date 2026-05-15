import { Navigate } from "react-router-dom";
import { getUser, isAuthed } from "../auth";

export default function ProtectedRoute({ children, role }) {
  if (!isAuthed()) {
    const to = role === "admin" ? "/StaffLogin" : role === "employee" ? "/QuartersApplyLogin" : "/";
    return <Navigate to={to} replace />;
  }

  if (role) {
    const user = getUser();
    if (!user?.role || user.role !== role) return <Navigate to="/" replace />;
  }

  return children;
}
