import { createBrowserRouter } from 'react-router-dom'

import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'

export const Router = createBrowserRouter([
  { path: '/', element: <SignIn /> },
  { path: '/sign-up', element: <SignUp /> }
])
