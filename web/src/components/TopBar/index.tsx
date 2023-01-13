import React, { useCallback, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import MultifyLogo from '../../assets/multify-logo.png'
import { UPDATE_USER } from '../../graphql/mutations/updateUser'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import { Input } from '../Input'
import { Button } from '../Button'
import { CustomPopup } from '../CustomPopup'
import { yupFormValidator } from '../../utils/yupFormValidator'
import { PopupContentContainer, TopBarContainer } from './styles'

interface IUpdateUserResponse {
  updateUser: {
    id: string
    name: string
    email: string
    username: string
  }
}

export const TopBar: React.FC = () => {
  const toast = useToast()
  const client = useApolloClient()
  const { user, signOut, updateUserData } = useAuth()

  const [showUserPopup, setShowUserPopup] = useState(false)
  const [editingUserData, setEditingUserData] = useState(false)
  const [updateUserLoading, setUpdateUserLoading] = useState(false)

  const [newName, setNewName] = useState(user?.name ?? '')
  const [newEmail, setNewEmail] = useState(user?.email ?? '')
  const [newUsername, setNewUsername] = useState(user?.username ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const toggleShowUserPopup = useCallback(() => {
    setShowUserPopup(!showUserPopup)
  }, [showUserPopup])

  const toggleEditingUserData = useCallback(() => {
    setEditingUserData(!editingUserData)
  }, [editingUserData])

  const handleGetProfileImageLetters = useCallback((): string => {
    if (!user) {
      return '??'
    }

    const [firstName, lastName] = user.name.split(' ')

    if (lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }

    return firstName.substring(0, 2).toUpperCase()
  }, [user])

  const handleUpdateProfile = useCallback(async () => {
    if (!user) {
      return
    }

    const profileData = {
      user_id: user.id,
      name: newName,
      email: newEmail,
      username: newUsername,
      newPassword,
      currentPassword
    }

    const schema = Yup.object().shape({
      user_id: Yup.string().uuid('UUID invalido do usuário')
        .required('Não foi possível recuperar o ID do usuário!'),
      name: Yup.string(),
      email: Yup.string(),
      username: Yup.string(),
      newPassword: Yup.string(),
      currentPassword: Yup.string().required('A senha atual é obrigatória!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: profileData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    setUpdateUserLoading(true)

    try {
      const { data } = await client.mutate<IUpdateUserResponse>({
        mutation: UPDATE_USER,
        variables: { data: profileData }
      })

      const updateUser = data?.updateUser ?? user

      updateUserData({
        name: updateUser.name,
        email: updateUser.email,
        username: updateUser.username
      })

      toast.addToast({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      })

      setNewPassword('')
      setCurrentPassword('')

      toggleEditingUserData()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setUpdateUserLoading(false)
  }, [client, currentPassword, newEmail, newName, newPassword, newUsername, toggleEditingUserData, updateUserData, user])

  return (
    <TopBarContainer backgroundColor={user ? '#12191D' : 'transparent'} >
      <div id="top-bar-content">
        <Link to="/" id="top-bar-multify-link">
          <img src={MultifyLogo} alt="Multify" id="top-bar-multify-logo" />
        </Link>

        {
          user && (
            <button id="top-bar-user-icon" onClick={toggleShowUserPopup}>
              {handleGetProfileImageLetters()}
            </button>
          )
        }

        {
          showUserPopup && (
            <CustomPopup onClickToClose={toggleShowUserPopup}>
              <PopupContentContainer>
                <div id="popup-container">
                  <span id="popup-user-icon" onClick={toggleShowUserPopup}>
                    {handleGetProfileImageLetters()}
                  </span>

                  <div id="popup-content-container">
                    <div id="popup-user-info-container">

                      {
                        editingUserData
                          ? (<>
                            <div id="popup-user-edit-info">
                              <div className="popup-user-edit-input">
                                <Input
                                  placeholder="Nome"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                />
                              </div>

                              <div className="popup-user-edit-input">
                                <Input
                                  placeholder="Email"
                                  value={newEmail}
                                  onChange={(e) => setNewEmail(e.target.value)}
                                />
                              </div>

                              <div className="popup-user-edit-input">
                                <Input
                                  placeholder="Usuário (igual ao multidados)"
                                  value={newUsername}
                                  onChange={(e) => setNewUsername(e.target.value)}
                                />
                              </div>
                            </div>

                            <div id="popup-user-edit-password">
                              <div className="popup-user-edit-input">
                                <Input
                                  placeholder="Atualizar senha (igual ao multidados)"
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                />
                              </div>
                            </div>

                            <div id="popup-user-edit-current-password">
                              <div className="popup-user-edit-input">
                                <Input
                                  placeholder="Senha atual"
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                              </div>
                            </div>
                          </>)
                          : (<>
                            <span id="popup-user-info-name">
                              {user?.name}
                            </span>

                            <span className="popup-user-info-email-username">
                              {user?.email}
                            </span>

                            <span className="popup-user-info-email-username">
                              {user?.username}
                            </span>
                          </>)
                      }

                    </div>
                  </div>
                </div>

                <div id="popup-edit-user-button-container">
                  {
                    editingUserData && (
                      <Button
                        text="Cancelar"
                        buttonStyle="danger"
                        onClick={toggleEditingUserData}
                      />
                    )
                  }

                  <Button
                    text={editingUserData ? 'Salvar' : 'Editar'}
                    buttonStyle="primary"
                    isLoading={editingUserData && updateUserLoading}
                    onClick={editingUserData ? handleUpdateProfile : toggleEditingUserData}
                  />
                </div>

                <Button
                  text="Sair"
                  buttonStyle="danger"
                  onClick={signOut}
                />
              </PopupContentContainer>
            </CustomPopup>
          )
        }
      </div>
    </TopBarContainer>
  )
}
