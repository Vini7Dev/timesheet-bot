import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #263238;
    color: #FFF;
    -webkit-font-smoothing: antialiased;
  }

  body, button, input {
    font-family: 'Roboto Slab', serif;
    font-size: 1rem;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-family: 'Roboto Slab', serif;
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`
