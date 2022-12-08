import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { Button } from '../Button'
import { EmptyListAlertContainer } from './styles'

interface IEmptyListAlertProps {
  alertButton?: {
    buttonText: string
    onClick: () => void
  }
}

export const EmptyListAlert: React.FC<IEmptyListAlertProps> = ({
  alertButton
}) => {
  return (
    <EmptyListAlertContainer>
      <strong>
        <FiAlertTriangle /> Lista vazia!
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
    </EmptyListAlertContainer>
  )
}
