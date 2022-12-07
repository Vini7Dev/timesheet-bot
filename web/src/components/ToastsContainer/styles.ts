import styled, { css } from 'styled-components'

interface IToastProps {
  type: 'info' | 'success' | 'error'
}

export const Container = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 1.875rem;
  overflow: hidden;
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
  width: 22.5rem;
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
`
