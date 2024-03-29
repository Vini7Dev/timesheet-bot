import styled, { css } from 'styled-components'

interface IToastProps {
  type: 'info' | 'success' | 'error'
}

export const Container = styled.div`
  position: fixed;
  right: 0;
  top: 5.25rem;
  overflow: hidden;
  width: 100vw;
  z-index: 10;

  @media screen and (min-width: 969px) {
    right: 1.25rem;
    width: auto;
  }
`

const toastTypes = {
  success: css`
    background: #E6FFFA;
    color: #2E656A;
  `,
  info: css`
    background: #EBF8FF;
    color: #3172B7;
  `,
  error: css`
    background: #FDDEDE;
    color: #C53030;
  `
}

export const Toast = styled.div<IToastProps>`
  cursor: pointer;
  position: relative;
  display: flex;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.625rem;
  border-radius: 0.625rem;
  box-shadow: 0.125rem 0.125rem 0.5rem rgba(0, 0, 0, 0.2);

  ${props => toastTypes[props.type]}

  span {
    opacity: 0.8;
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    line-height: 1.25rem;

    svg {
      margin-right: 0.25rem;
    }
  }

  @media screen and (min-width: 969px) {
    width: 22.5rem;
  }
`
