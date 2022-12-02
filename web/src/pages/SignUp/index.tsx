import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { CREATE_USER } from '../../graphql/createUser'
import { MainContent, PageContainer, SignUpForm } from './styles'

interface ICreateUserResponse {
  createUser: {
    id: string
  }
}

export const SignUp: React.FC = () => {
  const [createUser] = useMutation<ICreateUserResponse>(CREATE_USER)

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleGoToSignIn = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleCreateUser = useCallback(async () => {
    const { data, errors } = await createUser({
      variables: {
        data: {
          name,
          email,
          username,
          password
        }
      }
    })

    if (!errors && data) {
      navigate('/')
    }
  }, [createUser, email, name, navigate, password, username])

  return (
    <PageContainer>
      <TopBar />

      <MainContent>
        <SignUpForm>
          <h1 id="page-title">Criar conta</h1>

          <div className="input-margin-bottom">
            <Input
              placeholder="Informe seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-margin-bottom">
            <Input
              placeholder="Informe seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-margin-bottom">
            <Input
              placeholder="Informe seu usuário do multidados"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-margin-bottom">
            <Input
              placeholder="Informe sua senha do multidados." type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="button-margin-top">
            <Button text="Cadastrar-se" onClick={handleCreateUser} />
          </div>

          <span id="without-account-message">Já possuí uma conta?</span>
          <Button text="Entrar" onClick={() => handleGoToSignIn()} />
        </SignUpForm>
      </MainContent>
    </PageContainer>
  )
}
