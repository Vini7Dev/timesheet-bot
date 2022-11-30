import { Route, Routes } from 'react-router-dom'
import { Markings } from '../pages/Markings'

import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'

export const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} index />
      <Route path="/sign-up" element={<SignUp />} />

      <Route path="/markings" element={<Markings />} />
    </Routes>
  )
}
