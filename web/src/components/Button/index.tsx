/* eslint-disable react/prop-types */
import { ButtonHTMLAttributes } from 'react'
import { ButtonContainer } from './styles'
import { PulseLoader } from 'react-spinners'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  buttonStyle?: 'primary' | 'danger'
  isLoading?: boolean
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type = 'button',
  buttonStyle = 'primary',
  isLoading = false,
  ...rest
}) => {
  return (
    <ButtonContainer buttonStyle={buttonStyle}>
      <button type={type} {...rest}>{
        isLoading ? <PulseLoader color="#FFF" size={8} /> : text
      }</button>
    </ButtonContainer>
  )
}
