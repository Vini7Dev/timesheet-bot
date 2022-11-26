import { Route, Routes } from 'react-router-dom'

import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'

export const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} index />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  )
}
