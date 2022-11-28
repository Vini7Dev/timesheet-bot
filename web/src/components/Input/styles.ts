import styled, { css } from 'styled-components'

interface IInputContainerProps {
  inputStyle?: 'normal' | 'timer'
}

export const InputContainer = styled.div<IInputContainerProps>`
  width: 100%;
  height: 2.5rem;
  background-color: #1D272C;
  border-radius: 0.125rem;

  ${({ inputStyle }) => {
    switch (inputStyle) {
      case 'normal': return css`
        border: 0.063rem solid #12191d;
      `
      case 'timer': return css`
        height: 100%;
      `
      default: return null
    }
  }}

  input {
    display: block;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    padding: 0.608rem 0.75rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    color: #C6D2D9;
  }
`
