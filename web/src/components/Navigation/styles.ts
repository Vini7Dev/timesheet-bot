import styled from 'styled-components'

export const NavigationContainer = styled.aside`
  width: 100%;
  height: 20px;

  #left-navigation-bar {
    position: fixed;
    top: 80px;
    width: 100%;
    background-color: #1D272C;
    box-shadow: 1px 0 #12191D;
    z-index: 10;

    #toggle-mobile-navigation-menu {
      position: absolute;
      top: -50px;
      left: 12px;
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
        height: 50px;
        padding-left: 18px;
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
            margin-right: 8px;
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
    width: 200px;

    #left-navigation-bar {
      position: fixed;
      top: 80px;
      height: 100%;
      width: 150px;

      #toggle-mobile-navigation-menu {
        display: none;
      }
    }
  }
`
