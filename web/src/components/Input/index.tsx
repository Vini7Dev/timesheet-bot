import React, { InputHTMLAttributes } from 'react'

import { InputContainer } from './styles'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  inputStyle?: 'normal' | 'high'
  onClickInContainer?: () => void
}

export const Input: React.FC<IInputProps> = ({
  placeholder,
  inputStyle = 'normal',
  onClickInContainer,
  ...rest
}) => {
  return (
    <InputContainer inputStyle={inputStyle} onClick={onClickInContainer}>
      <input placeholder={placeholder} {...rest} />
    </InputContainer>
  )
}
