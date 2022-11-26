import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { MainContent, PageContainer, SignUpForm } from './styles'

export const SignUp: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToSignIn = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <PageContainer>
      <TopBar />

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
          <Button text="Entrar" onClick={() => handleGoToSignIn()} />
        </SignUpForm>
      </MainContent>
    </PageContainer>
  )
}
