import styled from 'styled-components'

interface ITopBarContainerProps {
  backgroundColor: string
}

export const TopBarContainer = styled.div<ITopBarContainerProps>`
  height: 5rem;

  #top-bar-content {
    width: 100%;
    position: fixed;
    bottom: auto;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
    padding: 1.25rem;
    padding-left: 50px;
    background-color: ${({ backgroundColor }) => backgroundColor};
    z-index: 10;

    #top-bar-multify-link #top-bar-multify-logo {
      height: 3.125rem;
      margin-top: 0.5rem;
    }

    #top-bar-user-icon {
      display: block;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 100%;
      border: none;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #FFF;
      background-color: #3F51B5;
    }
  }

  @media screen and (min-width: 969px) {
    #top-bar-content {
      padding: 1.25rem;
    }
  }
`
