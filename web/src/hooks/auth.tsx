import React, { createContext, useCallback, useContext } from 'react'

import { LOGIN_USER } from '../graphql/loginUser'
import { useMutation } from '@apollo/client'

interface IUser {
  id: string
  name: string
  email: string
  username: string
}

interface ILoginCredentials {
  emailOrUsername: string
  password: string
}

interface IAuthContext {
  user?: IUser
  signIn: (loginCredentials: ILoginCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<IAuthContext>({} as unknown as IAuthContext)

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER)

  const signIn = useCallback(async ({
    emailOrUsername,
    password
  }: ILoginCredentials) => {
    await loginUser({
      variables: {
        loginUserData: {
          emailOrUsername,
          password
        }
      }
    })
  }, [loginUser])

  const signOut = useCallback(() => {
    //
  }, [])

  if (loading) return <p>Loading...</p>
  if (error != null) return <p>Error!</p>

  return (
    <AuthContext.Provider value={{ user: undefined, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)

  return context
}
