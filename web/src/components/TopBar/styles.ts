import styled from 'styled-components'

interface ITopBarContainerProps {
  backgroundColor: string
}

export const TopBarContainer = styled.div<ITopBarContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  padding: 1.25rem 1.25rem;
  background-color: ${({ backgroundColor }) => backgroundColor};

  a#top-bar-multify-link img#top-bar-multify-logo {
    height: 3.125rem;
    margin-top: 0.5rem;
  }

  button#top-bar-user-icon {
    display: block;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    color: #FFF;
    background-color: #3F51B5;
  }
`
