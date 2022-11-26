import { Route, Routes } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'

import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'

export const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} index />
      <Route path="/sign-up" element={<SignUp />} />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
