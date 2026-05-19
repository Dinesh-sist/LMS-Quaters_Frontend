import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'
import Home from './Home/Home'
import About from './Home/About'
import QuartersApplyLogin from './Home/QuatersApplyLogin'
import StaffLogin from './Home/StaffLogin'
import ApplyForQuarters from './Pages/Employee/ApplyForQuarters'
import ApplyForQuartersEmployees from './Pages/Employee/ApplyForQuartersEmployees'
import CheckApproval from './Pages/Employee/CheckforApproval'
import DemandNote from './Pages/Employee/DemandNote'
import VerifyQuarterApplication from './Pages/Admin/VerifyQuaterApplication'
import StatusOfApplications from './Pages/Admin/StatusOfApplications'
import HouseAllotmentCommitteeHistory from './Pages/Admin/HouseAllotmentCommitteeHistory'
import AdminDashboard from './Pages/Admin/AdminUI/dashboard'
import ProtectedRoute from './Pages/ProtectedRoute'


function App() {
  return (
    <BrowserRouter>
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
        <Route
          path="/Quarters/Apply"
          element={
            <ProtectedRoute role="employee">
              <ApplyForQuarters />
            </ProtectedRoute>
          }
        />
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
          path="/Quarters/DemandNote"
          element={
            <ProtectedRoute role="employee">
              <DemandNote />
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
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
