import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import MultifyLogo from '../../assets/multify-logo.png'
import { useAuth } from '../../hooks/auth'
import { Button } from '../Button'
import { CustomPopup } from '../CustomPopup'
import { PopupContentContainer, TopBarContainer } from './styles'

export const TopBar: React.FC = () => {
  const { user, signOut } = useAuth()

  const [showUserPopup, setShowUserPopup] = useState(false)

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

  const toggleShowUserPopup = useCallback(() => {
    setShowUserPopup(!showUserPopup)
  }, [showUserPopup])

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
                      <span id="popup-user-info-name">
                        {user?.name}
                      </span>

                      <span className="popup-user-info-email-username">
                        {user?.email}
                      </span>

                      <span className="popup-user-info-email-username">
                        {user?.username}
                      </span>
                    </div>
                  </div>
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
