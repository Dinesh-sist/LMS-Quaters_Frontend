import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import './index.css'
import Home from './Home/Home'
import About from './Home/About'
import QuartersApplyLogin from './Home/QuatersApplyLogin'
import EmployeeRegister from './Home/EmployeeRegister'
import StaffLogin from './Home/StaffLogin'
import ApplyForQuartersEmployees from './Pages/Employee/ApplyForQuartersEmployees'
import CheckApproval from './Pages/Employee/CheckforApproval'

import VerifyQuarterApplication from './Pages/Admin/VerifyQuaterApplication'
import StatusOfApplications from './Pages/Admin/StatusOfApplications'
import HouseAllotmentCommitteeHistory from './Pages/Admin/HouseAllotmentCommitteeHistory'
import AdminDashboard from './Pages/Admin/dashboard'
import ProtectedRoute from './Pages/ProtectedRoute'
import SetDateForApplication from './Pages/Admin/SetDateForApplication'
import AdminMappage from './Pages/Admin/AdminMappage'
import EmployeeClassUpdation from './Pages/Admin/EmployeeClassUpdation'
import UpdateStatusOfQuarters from './Pages/Admin/UpdateStatusofQuarters'
import { consumeAuthRecovery, getToken, getUser, setAuth } from './auth'

function TranslateRecovery() {
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const recovery = consumeAuthRecovery();
    if (!recovery) return;

    if ((!getToken() || !getUser()) && recovery.token && recovery.user) {
      setAuth({ token: recovery.token, user: recovery.user });
    }

    const target = recovery.redirectTo;
    const current = `${location.pathname}${location.search}${location.hash}`;

    if (target && target !== current) {
      navigate(target, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TranslateRecovery />
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/about"               element={<About />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/QuartersApplyLogin"  element={<QuartersApplyLogin />} />
        <Route path="/EmployeeRegister"    element={<EmployeeRegister />} />
        <Route
          path="/Quarters/ApplyEmployees"
          element={
            <ProtectedRoute role="employee">
              <ApplyForQuartersEmployees />
            </ProtectedRoute>
          }
        />
        <Route path="/StaffLogin"          element={<StaffLogin />} />
        <Route
          path="/Quarters/Approval"
          element={
            <ProtectedRoute role="employee">
              <CheckApproval />
            </ProtectedRoute>
          }
        />       
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verify"
          element={
            <ProtectedRoute role="admin">
              <VerifyQuarterApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/status"
          element={
            <ProtectedRoute role="admin">
              <StatusOfApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <ProtectedRoute role="admin">
              <HouseAllotmentCommitteeHistory />
            </ProtectedRoute>
          }
        />
          <Route
            path="/admin/date"
            element={
              <ProtectedRoute role="admin">
                <SetDateForApplication />
              </ProtectedRoute>
            }
          />
        <Route
          path="/admin/map"
          element={
            <ProtectedRoute role="admin">
              <AdminMappage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classupdation"
          element={
            <ProtectedRoute role="admin">
              <EmployeeClassUpdation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quartersupdation"
          element={
            <ProtectedRoute role="admin">
              <UpdateStatusOfQuarters />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App














