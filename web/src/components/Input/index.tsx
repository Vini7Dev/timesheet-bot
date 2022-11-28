import React, { InputHTMLAttributes } from 'react'

import { InputContainer } from './styles'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  inputStyle?: 'normal' | 'timer'
}

export const Input: React.FC<IInputProps> = ({
  placeholder,
  inputStyle = 'normal',
  ...rest
}) => {
  return (
    <InputContainer inputStyle={inputStyle}>
      <input placeholder={placeholder} {...rest} />
    </InputContainer>
  )
}
