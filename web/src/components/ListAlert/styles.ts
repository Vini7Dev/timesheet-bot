import styled from 'styled-components'

export const ListAlertContainer = styled.div`
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
      margin-right: 0.5rem;
    }
  }

  div {
    width: 100%;
    max-width: 17.5rem;
    margin-top: 0.5rem;
  }

  @media screen and (min-width: 969px) {
    border: none;
  }
`
