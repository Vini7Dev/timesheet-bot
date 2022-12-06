import React, { useCallback, useEffect } from 'react'
import { FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi'
import { useToast } from '../../hooks/toast'

import { Container, Toast } from './styles'

type MessageType = 'success' | 'info' | 'error'

interface IMessageProps {
  id: string
  message: string
  type: MessageType
}

interface IToastsContainerProps {
  messages: IMessageProps[]
}

export const ToastsContainer: React.FC<IToastsContainerProps> = ({ messages }) => {
  const { removeToast } = useToast()

  const toastIcons = {
    success: <FiCheckCircle size={20} />,
    info: <FiInfo size={20} />,
    error: <FiXCircle size={20} />
  }

  const handleRemoveToast = useCallback((id: string) => {
    removeToast(id)
  }, [removeToast])

  return (
    <Container>
      {messages.map(({ id, message, type }) => (
        <Toast key={id} type={type} onClick={() => handleRemoveToast(id)} >
          <span>{toastIcons[type]} {message}</span>
        </Toast>
      ))}
    </Container>
  )
}
