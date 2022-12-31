import { createContext, useCallback, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ToastsContainer } from '../components/ToastsContainer'

type MessageType = 'success' | 'info' | 'error'

interface IToastProps {
  id: string
  message: string
  type: MessageType
}

interface IAddToastProps {
  message: string
  type: MessageType
}

interface IToastContext {
  messages: IToastProps[]
  addToast: (data: IAddToastProps) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<IToastContext>({} as unknown as IToastContext)

// eslint-disable-next-line react/prop-types
export const ToastProvider: React.FC<any> = ({ children }) => {
  const [messages, setMessages] = useState<IToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setMessages(oldMessages => oldMessages.filter(message => message.id !== id))
  }, [])

  const addToast = useCallback(({ message, type }: IAddToastProps) => {
    const id = uuidv4()

    const newMessage = {
      id,
      message,
      type
    }

    setMessages(oldMessages => [...oldMessages, newMessage])

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ messages, addToast, removeToast }}>
      {children}

      <ToastsContainer messages={messages} />
    </ToastContext.Provider>
  )
}

export const useToast = (): IToastContext => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.')
  }

  return context
}
