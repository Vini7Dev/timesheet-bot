import styled from 'styled-components'

export const NavigationContainer = styled.aside`
  width: 100%;
  height: 1.25rem;

  #left-navigation-bar {
    position: fixed;
    top: 5rem;
    width: 100%;
    background-color: #1D272C;
    box-shadow: 1px 0 #12191D;
    z-index: 10;

    #toggle-mobile-navigation-menu {
      position: absolute;
      top: -3.125rem;
      left: 0.75rem;
      border: none;
      background-color: transparent;
    }

    #left-navigation-list {
      display: block;
      width: 100%;
      list-style: none;

      .left-navigation-item {
        display: flex;
        align-items: center;
        height: 3.125rem;
        padding-left: 1.125rem;
        width: 100%;

        a {
          font-family: 'Roboto', sans-serif;
          font-size: 0.75rem;
          color: #90A4AE;
          text-decoration: none;
          text-transform: uppercase;
          display: flex;
          align-items: center;

          svg {
            margin-right: 0.5rem;
          }
        }
      }

      .left-navigation-item-select {
        background-color: #12191D;
        border: 1px solid #607D8B;
      }
    }
  }

  @media screen and (min-width: 969px) {
    width: 12.5rem;

    #left-navigation-bar {
      position: fixed;
      top: 5rem;
      height: 100%;
      width: 9.375rem;

      #toggle-mobile-navigation-menu {
        display: none;
      }
    }
  }
`
