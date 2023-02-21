import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconType } from 'react-icons'

import { NavigationContainer } from './styles'
import { useRuntime } from '../../hooks/runtime'
import { useNavigation } from '../../hooks/navigation'
import { navigationGroupsList } from '../../utils/navigationGroupsList'

interface INavigationOptionProps {
  url: string
  text: string
  icon: IconType
}

interface INavigationGroupProps {
  groupName: string
  options: INavigationOptionProps[]
}

export const Navigation: React.FC = () => {
  const {
    mobileNavigationIsOpen
  } = useNavigation()

  const { isMobile } = useRuntime()

  const [navigationGroups] = useState<INavigationGroupProps[]>(navigationGroupsList)

  const handleShowNavigationList = useCallback(() => {
    if (isMobile) {
      return mobileNavigationIsOpen
    }

    return true
  }, [isMobile, mobileNavigationIsOpen])

  return (
    <NavigationContainer mobileNavigationIsOpen={mobileNavigationIsOpen}>
      <nav id="left-navigation-bar">
        {
          handleShowNavigationList() && navigationGroups.map(({
            groupName,
            options
          }, index) => (
            <div key={index} className="left-navigation-group">
              <strong className="left-navitagion-group-name">{groupName}</strong>
              <ul className="left-navigation-list">
              {
                options.map(({ text, url, icon: Icon }, index) => (
                  <li
                    key={index}
                    className={`left-navigation-item ${
                      url === window.location.pathname
                        ? 'left-navigation-item-select'
                        : ''
                    }`}
                  >
                    {
                      url.includes('http')
                        ? (
                        <a href={url} target="_blank" rel="noreferrer">
                          <Icon size={18} /> {text}
                        </a>
                          )
                        : (
                        <Link to={url}>
                          <Icon size={18} /> {text}
                        </Link>
                          )
                    }
                  </li>
                ))
              }
              </ul>
            </div>
          ))
        }
      </nav>
    </NavigationContainer>
  )
}
