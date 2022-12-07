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

export const CreateProjectOrCustomerForm = styled.form`
  #form-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .input-margin-bottom {
    margin-bottom: 0.875rem;
  }

  .button-margin-top {
    margin-top: 1.5rem;
  }

  #create-customer-link {
    display: block;
    width: fit-content;
    margin: 0.625rem 0 1.25rem auto;
    font-family: 'Roboto', sans-serif;
    font-size: 0.875rem;
    color: #008BEA;
    text-decoration: underline;
  }
`
