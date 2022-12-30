import styled from 'styled-components'

export const CustomPopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #0000004F;

  .custom-popup-outside-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000070;
  }

  .custom-popup-content-area {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #1D272C;
    width: 100%;
    max-width: 40rem;
    padding: 2rem;
    margin: 0.625rem;
    box-shadow: 0 0 1.25rem #0000008f;
    z-index: 1;

    #custom-popup-close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      border: none;
      background: none;
    }
  }
`
