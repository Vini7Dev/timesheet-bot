/* eslint-disable react/prop-types */
import { ButtonHTMLAttributes } from 'react'
import { ButtonContainer } from './styles'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
}

export const Button: React.FC<IButtonProps> = ({
  text
}) => {
  return (
    <ButtonContainer>
      <button>{text}</button>
    </ButtonContainer>
  )
}
