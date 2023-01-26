import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { yupFormValidator } from '../../utils/yupFormValidator'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { CREATE_USER } from '../../graphql/mutations/createUser'
import { useToast } from '../../hooks/toast'
import { MainContent, PageContainer, SignUpForm } from './styles'

interface ICreateUserResponse {
  createUser: {
    id: string
  }
}

export const SignUp: React.FC = () => {
  const toast = useToast()

  const [createUser, { loading }] = useMutation<ICreateUserResponse>(CREATE_USER, {
    onError: (error) => {
      toast.addToast({
        type: 'error',
        message: error.message
      })
    },
    onCompleted: () => {
      toast.addToast({
        type: 'success',
        message: 'Conta criada com sucesso!'
      })
    }
  })

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleGoToSignIn = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleCreateUser = useCallback(async () => {
    const userData = {
      name,
      email,
      username,
      password
    }

    const schema = Yup.object().shape({
      name: Yup.string().required('O nome é obrigatório!'),
      email: Yup.string().required('O email é obrigatório!'),
      username: Yup.string().required('O username é obrigatório!'),
      password: Yup.string().required('A senha é obrigatória!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: userData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    const { data, errors } = await createUser({
      variables: {
        data: userData
      }
    })

    if (!errors && data) {
      navigate('/')
    }
  }, [createUser, email, name, navigate, password, username, toast.addToast])

  return (
    <PageContainer>
      <TopBar />

      <MainContent>
        <SignUpForm>
          <h1 id="page-title">Criar conta</h1>

          <div className="input-margin-bottom">
            <Input
              autoFocus
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
            <Button text="Cadastrar-se" onClick={handleCreateUser} isLoading={loading} />
          </div>

          <span id="without-account-message">Já possuí uma conta?</span>
          <Button text="Entrar" onClick={() => handleGoToSignIn()} />
        </SignUpForm>
      </MainContent>
    </PageContainer>
  )
}
