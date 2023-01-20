import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { ClockLoader } from 'react-spinners'

import { Button } from '../Button'
import { ListAlertContainer } from './styles'

type AlertType = 'empty' | 'loading'

interface IListAlertProps {
  alertText?: string
  alertType?: AlertType
  alertButton?: {
    buttonText: string
    onClick: () => void
  }
}

export const ListAlert: React.FC<IListAlertProps> = ({
  alertText = 'Lista vazia!',
  alertType = 'empty',
  alertButton
}) => {
  return (
    <ListAlertContainer>
      <strong>
        {
          (() => {
            switch (alertType) {
              case 'empty':
                return (<><FiAlertTriangle />{alertText}</>)

              case 'loading':
                return (<ClockLoader color="#C6D2D9" size={32} />)

              default:
                return null
            }
          })()
        }
      </strong>

      {
        alertButton
          ? (
              <div>
                <Button
                  text={alertButton?.buttonText ?? ''}
                  onClick={alertButton?.onClick}
                />
              </div>
            )
          : null
      }
    </ListAlertContainer>
  )
}
