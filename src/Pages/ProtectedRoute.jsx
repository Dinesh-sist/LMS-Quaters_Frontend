import { Navigate } from "react-router-dom";
import { clearAuth, getUser, isAuthed } from "../auth";

function getLoginRedirect(role) {
  return role === "admin" ? "/StaffLogin" : role === "employee" ? "/QuartersApplyLogin" : "/";
}

export default function ProtectedRoute({ children, role }) {
  if (!isAuthed()) {
    return <Navigate to={getLoginRedirect(role)} replace />;
  }

  const user = getUser();

  if (!user?.role) {
    clearAuth();
    return <Navigate to={getLoginRedirect(role)} replace />;
  }

  if (role && user.role !== role) {
    clearAuth();
    return <Navigate to={getLoginRedirect(role)} replace />;
  }

  return children;
}




