/* eslint-disable react/prop-types */
import { ButtonHTMLAttributes } from 'react'
import { ButtonContainer } from './styles'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type = 'button',
  ...rest
}) => {
  return (
    <ButtonContainer>
      <button type={type} {...rest}>{text}</button>
    </ButtonContainer>
  )
}
