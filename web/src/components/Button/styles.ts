import styled, { css } from 'styled-components'

interface IButtonContainerProps {
  buttonStyle: 'primary' | 'danger'
}

export const ButtonContainer = styled.div<IButtonContainerProps>`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.125rem;

  ${({ buttonStyle }) => {
    switch (buttonStyle) {
      case 'primary': return css`
        background-color: #008BEA;
      `

      case 'danger': return css`
        background-color: #F44336;
      `

      default: return null
    }
  }}

  button {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    color: #FFF;
  }
`
