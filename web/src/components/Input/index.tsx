import React, { InputHTMLAttributes } from 'react'

import { InputContainer } from './styles'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  inputStyle?: 'normal' | 'high'
  containerStyle?: React.CSSProperties
  onClickInContainer?: () => void
}

export const Input: React.FC<IInputProps> = ({
  placeholder,
  inputStyle = 'normal',
  containerStyle,
  onClickInContainer,
  ...rest
}) => {
  return (
    <InputContainer
      inputStyle={inputStyle}
      onClick={onClickInContainer}
      style={containerStyle}
    >
      <input placeholder={placeholder} {...rest} />
    </InputContainer>
  )
}
