import styled from 'styled-components'

export const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);
`

export const TopBar = styled.div`
  height: 5rem;
  padding: 1.25rem 1.25rem;

  a img {
    height: 3.125rem;
  }
`

export const MainContent = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #1D272C;
  width: 100%;
  max-width: 31.25rem;
  padding: 2rem;
  margin: 0.625rem;
  box-shadow: 0 0 1.25rem #0000008f;

  h1#page-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  div.input-margin-bottom {
    margin-bottom: 0.875rem;
  }

  div.button-margin-top {
    margin-top: 0.5rem;
  }

  span#without-account-message {
    font-family: 'Roboto', sans-serif;
    font-size: 0.875rem;
    color: #FFF;
    margin: 1.5rem 0 0.25rem;
  }
`
