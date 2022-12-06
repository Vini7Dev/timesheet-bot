import styled, { css } from 'styled-components'

interface IToastProps {
  type: 'info' | 'success' | 'error'
}

export const Container = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  padding: 30px;
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
  width: 360px;
  padding: 12px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  ${props => toastTypes[props.type]}

  span {
    opacity: 0.8;
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    line-height: 20px;

    svg {
      margin-right: 4px;
    }
  }
`
