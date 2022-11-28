/* eslint-disable react/prop-types */
import { ButtonHTMLAttributes } from 'react'
import { ButtonContainer } from './styles'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  buttonStyle?: 'primary' | 'danger'
}

export const Button: React.FC<IButtonProps> = ({
  text,
  buttonStyle = 'primary',
  type = 'button',
  ...rest
}) => {
  return (
    <ButtonContainer buttonStyle={buttonStyle}>
      <button type={type} {...rest}>{text}</button>
    </ButtonContainer>
  )
}
