import React from 'react'

import MultifyLogo from '../../assets/multify-logo.png'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { MainContent, PageContainer, SignUpForm, TopBar } from './styles'

export const SignUp: React.FC = () => {
  return (
    <PageContainer>
      <TopBar>
        <a href="/">
          <img src={MultifyLogo} alt="Multify" id="site-logo" />
        </a>
      </TopBar>

      <MainContent>
        <SignUpForm>
          <h1 id="page-title">Criar conta</h1>

          <div className="input-margin-bottom">
            <Input placeholder="Informe seu nome" />
          </div>
          <div className="input-margin-bottom">
            <Input placeholder="Informe seu email" />
          </div>
          <div className="input-margin-bottom">
            <Input placeholder="Informe seu usuário do multidados" />
          </div>
          <div className="input-margin-bottom">
            <Input placeholder="Informe sua senha do multidados." type="password" />
          </div>

          <div className="button-margin-top">
            <Button text="Cadastrar-se" />
          </div>

          <span id="without-account-message">Já possuí uma conta?</span>
          <Button text="Entrar" />
        </SignUpForm>
      </MainContent>
    </PageContainer>
  )
}
