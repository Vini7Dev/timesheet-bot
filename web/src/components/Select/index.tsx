import React, { SelectHTMLAttributes } from 'react'

import { SelectContainer } from './styles'

interface ISelectOption {
  value: string
  label?: string
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: ISelectOption[]
  selectStyle?: 'normal' | 'timer'
}

export const Select: React.FC<ISelectProps> = ({
  selectStyle = 'normal',
  options,
  ...rest
}) => {
  return (
    <SelectContainer selectStyle={selectStyle}>
      <select {...rest}>
        {
          options.map(({ value, label }, index) => (
            <option key={index} value={value}>
              { label ?? value }
            </option>
          ))
        }
      </select>
    </SelectContainer>
  )
}
