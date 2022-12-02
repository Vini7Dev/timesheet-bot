import { Route, Routes } from 'react-router-dom'

import { useAuth } from '../hooks/auth'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { Markings } from '../pages/Markings'

export const MainRoutes: React.FC = () => {
  const { user } = useAuth()

  const withoutAuthRoutes = [
    { path: '/', element: SignIn, isIndex: true },
    { path: '/sign-up', element: SignUp }
  ]

  const authRoutes = [
    { path: '/', element: Markings, isIndex: true }
  ]

  const routesToUse = user?.id ? authRoutes : withoutAuthRoutes

  return (
    <Routes>
      {
        routesToUse.map(({ path, element: Element, isIndex }, index) => (
          <Route key={index} path={path} element={<Element />} index={isIndex} />
        ))
      }
    </Routes>
  )
}
