import styled from 'styled-components'

export const EmptyListAlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 8rem;
  border: 1px solid #12191D;

  strong {
    display: flex;
    align-items: center;
    font-family: 'Roboto',sans-serif;
    font-size: 1.25rem;
    color: #C6D2D9;

    svg {
      margin-right: 8px;
    }
  }

  div {
    width: 100%;
    max-width: 280px;
    margin-top: 8px;
  }

  @media screen and (min-width: 969px) {
    border: none;
  }
`
