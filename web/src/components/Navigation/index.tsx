import React, { useCallback, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FiClipboard, FiClock, FiMenu, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { NavigationContainer } from './styles'

interface INavigationOptionProps {
  url: string
  text: string
  icon: IconType
}

export const Navigation: React.FC = () => {
  const [mobileNavigationIsOpen, setMobileNavigationIsOpen] = useState(false)

  const [navigationOptions] = useState<INavigationOptionProps[]>([
    { url: '/', text: 'Marcações', icon: FiClock },
    { url: '/projects', text: 'Projetos', icon: FiClipboard },
    { url: '/customers', text: 'Clientes', icon: FiUsers }
  ])

  const toggleMobileNavigationIsOpen = useCallback(() => {
    setMobileNavigationIsOpen(!mobileNavigationIsOpen)
  }, [mobileNavigationIsOpen])

  useEffect(() => {
    const handleWindowResize = (): void => {
      if (window.innerWidth > 696) {
        setMobileNavigationIsOpen(true)
      }
    }

    handleWindowResize()

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <NavigationContainer>
      <nav id="left-navigation-bar">
        <button
          id="toggle-mobile-navigation-menu"
          onClick={toggleMobileNavigationIsOpen}
        >
          <FiMenu size={22} color="#90A4AE" />
        </button>

        {
          mobileNavigationIsOpen && (
            <ul id="left-navigation-list">
              {
                navigationOptions.map(({ text, url, icon: Icon }, index) => (
                  <li
                    key={index}
                    className={`left-navigation-item ${
                      url === window.location.pathname
                        ? 'left-navigation-item-select'
                        : ''
                    }`}
                  >
                    <Link to={url}>
                      <Icon size={18} /> {text}
                    </Link>
                  </li>
                ))
              }
            </ul>
          )
        }
      </nav>
    </NavigationContainer>
  )
}
