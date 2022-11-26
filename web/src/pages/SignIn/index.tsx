import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import MultifyLogo from '../../assets/multify-logo.png'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { MainContent, PageContainer, SignInForm, TopBar } from './styles'

export const SignIn: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToSignUp = useCallback(() => {
    navigate('/sign-up')
  }, [navigate])

  return (
    <PageContainer>
      <TopBar>
        <a href="/">
          <img src={MultifyLogo} alt="Multify" id="site-logo" />
        </a>
      </TopBar>

      <MainContent>
        <SignInForm>
          <h1 id="page-title">Entrar</h1>

          <div className="input-margin-bottom">
            <Input placeholder="Informe seu usuário ou email" />
          </div>
          <div className="input-margin-bottom">
            <Input placeholder="Informe sua senha" type="password" />
          </div>

          <a id="forgot-password-link" href="/">Esqueceu a senha?</a>

          <div className="button-margin-top">
            <Button text="Entrar" />
          </div>

          <span id="without-account-message">Ainda não tem uma conta?</span>
          <Button text="Cadastrar-se" onClick={() => handleGoToSignUp()} />
        </SignInForm>
      </MainContent>
    </PageContainer>
  )
}
