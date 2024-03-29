import React, { createContext, useCallback, useContext, useState } from 'react'

import { LOGIN_USER } from '../graphql/mutations/loginUser'
import { useMutation } from '@apollo/client'
import { useToast } from './toast'
import { useNavigate } from 'react-router-dom'

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
  email: string
  username: string
}

interface ILoginResponse {
  loginUser: ILoginData
}

interface IUpdateUserDataProps {
  name: string
  email: string
  username: string
}

interface IAuthContext {
  user?: IUser
  signIn: (loginCredentials: ILoginCredentials) => Promise<void>
  signOut: () => void
  updateUserData: (data: IUpdateUserDataProps) => void
}

const AuthContext = createContext<IAuthContext>({} as unknown as IAuthContext)

export const AuthProvider: React.FC<any> = ({ children }) => {
  const toast = useToast()
  const navigate = useNavigate()

  const [loginUser] = useMutation<ILoginResponse>(LOGIN_USER, {
    onError: () => {
      toast.addToast({
        type: 'error',
        message: 'Credenciais inválidas!'
      })
    },
    onCompleted: () => {
      toast.addToast({
        type: 'info',
        message: 'Seja bem-vindo(a)!'
      })
    }
  })

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
    setUser(undefined)
    localStorage.removeItem('@Multify:loginUser')

    navigate({
      pathname: '/'
    })
  }, [navigate])

  const updateUserData = useCallback(({
    name,
    email,
    username
  }: IUpdateUserDataProps) => {
    const updatedUser = user

    if (!updatedUser) {
      return
    }

    updatedUser.name = name
    updatedUser.email = email
    updatedUser.username = username

    setUser(updatedUser)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.')
  }

  return context
}
