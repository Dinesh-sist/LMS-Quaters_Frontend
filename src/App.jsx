import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'
import Home from './Home/Home'
import About from './Home/About'
import Dashboard from './Home/Dashboard'
import QuartersApplyLogin from './Home/QuatersApplyLogin'
import StaffLogin from './Home/StaffLogin'
import ApplyForQuarters from './Pages/Employee/ApplyForQuarters'
import CheckApproval from './Pages/Employee/CheckforApproval'
import VerifyQuarterApplication from './Pages/Admin/VerifyQuaterApplication'
import StatusOfApplications from './Pages/Admin/StatusOfApplications'
import HouseAllotmentCommitteeHistory from './Pages/Admin/HouseAllotmentCommitteeHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/about"             element={<About />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/QuartersApplyLogin" element={<QuartersApplyLogin />} />
        <Route path="/Quarters/Apply"    element={<ApplyForQuarters />} />
        <Route path="/StaffLogin"        element={<StaffLogin />} />
        <Route path="/Quarters/Approval" element={<CheckApproval />} />
        <Route path="/admin"             element={<Navigate to="/admin/verify" replace />} />
        <Route path="/admin/verify"      element={<VerifyQuarterApplication />} />
        <Route path="/admin/status"      element={<StatusOfApplications />} />
        <Route path="/admin/history"     element={<HouseAllotmentCommitteeHistory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
