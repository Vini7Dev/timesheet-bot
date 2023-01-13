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
    padding-left: 3.125rem;
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

export const PopupContentContainer = styled.div`
  #popup-container {
    display: flex;
    margin-bottom: 0.85rem;

    #popup-user-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 100%;
      border: none;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #FFF;
      background-color: #3F51B5;
      margin-right: 1rem;
    }

    #popup-content-container {
      width: 100%;

      #popup-user-info-name {
        display: block;
        font-family: 'Roboto',sans-serif;
        font-size: 1rem;
        color: #FFFFFF;
        margin: -0.05rem 0 0.40rem;
      }

      .popup-user-info-email-username {
        display: block;
        font-family: 'Roboto',sans-serif;
        font-size: 0.8571rem;
        color: #90A4AE;
        margin-bottom: 0.25rem;
      }

      #popup-user-edit-info .popup-user-edit-input {
        margin-bottom: 0.25rem;
      }

      #popup-user-edit-password,
      #popup-user-edit-current-password {
        margin-top: 1.5rem;
      }
    }
  }

  #popup-edit-user-button-container {
    margin-bottom: 0.65rem;
    margin-left: auto;
    max-width: 6.25rem;

    & > div {
      height: 2rem;
    }
  }

  @media screen and (min-width: 969px) {
    #popup-container {
      margin-bottom: 1.5rem;

      #popup-user-icon {
        height: 4rem;
        width: 4rem;
        font-size: 1.5rem;
      }

      #popup-content-container {
        #popup-user-info-name {
          font-size: 2rem;
          margin: -0.15rem 0 0.5rem;
        }

        .popup-user-info-email-username {
          font-size: 1rem;
        }
      }
    }
  }
`
