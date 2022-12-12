import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { useAuth } from '../../hooks/auth'
import { MainContent, PageContainer, SignInForm } from './styles'

export const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const [authIsLoading, setAuthIsLoading] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleGoToSignUp = useCallback(() => {
    navigate('/sign-up')
  }, [navigate])

  const handleSignIn = useCallback(async () => {
    setAuthIsLoading(true)

    await auth.signIn({
      emailOrUsername,
      password
    })

    setAuthIsLoading(false)
  }, [auth, emailOrUsername, password])

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

          <a id="forgot-password-link" href="/">Esqueceu a senha?</a>

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
