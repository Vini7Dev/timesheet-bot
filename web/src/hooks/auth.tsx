import React, { createContext, useCallback, useContext, useState } from 'react'

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

interface ILoginData {
  token: string
  user_id: string
  name: string
  username: string
  email: string
}

interface ILoginResponse {
  loginUser: ILoginData
}

interface IAuthContext {
  user?: IUser
  signIn: (loginCredentials: ILoginCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<IAuthContext>({} as unknown as IAuthContext)

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [loginUser, { loading, error }] = useMutation<ILoginResponse>(LOGIN_USER)

  const [user, setUser] = useState<IUser | undefined>(() => {
    const authUserFromLocalStorage = localStorage.getItem('@Multify:loginUser')

    if (authUserFromLocalStorage) {
      const authenticatedUser = JSON.parse(authUserFromLocalStorage) as ILoginData

      return {
        id: authenticatedUser.user_id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email
      }
    }
  })

  const signIn = useCallback(async ({
    emailOrUsername,
    password
  }: ILoginCredentials) => {
    const response = await loginUser({
      variables: {
        loginUserData: {
          emailOrUsername,
          password
        }
      }
    })

    if (!response.errors && response.data) {
      const { loginUser } = response.data

      localStorage.setItem('@Multify:loginUser', JSON.stringify(loginUser))

      setUser({
        id: loginUser.user_id,
        name: loginUser.name,
        username: loginUser.username,
        email: loginUser.email
      })
    }
  }, [loginUser])

  const signOut = useCallback(() => {
    //
  }, [])

  if (loading) return <p>Loading...</p>
  if (error != null) return <p>Error!</p>

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)

  return context
}