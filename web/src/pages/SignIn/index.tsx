import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { yupFormValidator } from '../../utils/yupFormValidator'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import { MainContent, PageContainer, SignInForm } from './styles'

export const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const auth = useAuth()

  const [authIsLoading, setAuthIsLoading] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleGoToSignUp = useCallback(() => {
    navigate('/sign-up')
  }, [navigate])

  const handleSignIn = useCallback(async () => {
    const loginData = {
      emailOrUsername,
      password
    }

    const schema = Yup.object().shape({
      emailOrUsername: Yup.string().required('O email ou username é obrigatório!'),
      password: Yup.string().required('A senha é obrigatória!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: loginData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    setAuthIsLoading(true)

    await auth.signIn(loginData)

    setAuthIsLoading(false)
  }, [auth, emailOrUsername, password, toast.addToast])

  return (
    <PageContainer>
      <TopBar />

      <MainContent>
        <SignInForm>
          <h1 id="page-title">Entrar</h1>

          <div className="input-margin-bottom">
            <Input
              placeholder="Informe seu usuário ou email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>
          <div className="input-margin-bottom">
            <Input
              placeholder="Informe sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/** <a id="forgot-password-link" href="/">Esqueceu a senha?</a> */}

          <div className="button-margin-top">
            <Button text="Entrar" onClick={handleSignIn} isLoading={authIsLoading} />
          </div>

          <span id="without-account-message">Ainda não tem uma conta?</span>
          <Button text="Cadastrar-se" onClick={() => handleGoToSignUp()} />
        </SignInForm>
      </MainContent>
    </PageContainer>
  )
}
