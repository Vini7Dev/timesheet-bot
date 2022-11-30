import React from 'react'
import { Link } from 'react-router-dom'

import MultifyLogo from '../../assets/multify-logo.png'
import { TopBarContainer } from './styles'

export const TopBar: React.FC = () => {
  const tempIsAuthenticated = true

  return (
    <TopBarContainer backgroundColor={tempIsAuthenticated ? '#12191D' : 'transparent'} >
      <div id="top-bar-content">
        <Link to="/" id="top-bar-multify-link">
          <img src={MultifyLogo} alt="Multify" id="top-bar-multify-logo" />
        </Link>

        {
          tempIsAuthenticated && (
            <button id="top-bar-user-icon">
              VG
            </button>
          )
        }
      </div>
    </TopBarContainer>
  )
}
