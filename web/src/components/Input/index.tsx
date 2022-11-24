import React, { InputHTMLAttributes } from 'react'

import { InputContainer } from './styles'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
}

export const Input: React.FC<IInputProps> = ({
  placeholder,
  ...rest
}) => {
  return (
    <InputContainer>
      <input placeholder={placeholder} {...rest} />
    </InputContainer>
  )
}
