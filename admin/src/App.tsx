import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminListingsPage } from './pages/admin/AdminListingsPage'
import { AdminListingForm } from './pages/admin/AdminListingForm'
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage'
import { AuthGuard } from './components/admin/AuthGuard'

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AuthGuard />}>
            <Route index element={<Navigate to="/listings" replace />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="listings/new" element={<AdminListingForm />} />
            <Route path="listings/:id" element={<AdminListingForm />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
