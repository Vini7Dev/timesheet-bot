import React from 'react'

import MultifyLogo from '../../assets/multify-logo.png'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { MainContent, PageContainer, SignInForm, TopBar } from './styles'

export const SignIn: React.FC = () => {
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

          <Input placeholder="Informe seu usuário" />
          <Input placeholder="Informe sua senha" type="password" />

          <a id="forgot-password-link" href="/">Esqueceu a senha?</a>

          <Button text="Entrar" />

          <span id="without-account-message">Ainda não tem uma conta?</span>
          <Button text="Cadastrar-se" />
        </SignInForm>
      </MainContent>
    </PageContainer>
  )
}
