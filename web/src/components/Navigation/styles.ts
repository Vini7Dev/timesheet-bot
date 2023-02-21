import styled, { css } from 'styled-components'

interface INavigationContainerProps {
  mobileNavigationIsOpen: boolean
}

export const NavigationContainer = styled.aside<INavigationContainerProps>`
  width: 100%;
  height: 1.25rem;

  #left-navigation-bar {
    position: fixed;
    top: 5rem;
    width: 100%;
    overflow-y: auto;
    background-color: #1D272C;
    box-shadow: 1px 0 #12191D;
    z-index: 10;

    ${({ mobileNavigationIsOpen }) => mobileNavigationIsOpen && css`height: calc(100vh - 5rem);`}

    .left-navigation-group {
      .left-navitagion-group-name {
        display: block;
        text-align: center;
        padding: 0.5rem;
        font-family: 'Roboto', sans-serif;
        font-size: 0.85rem;
        color: #C6D2D9;
        text-decoration: none;
        text-transform: uppercase;
        background-color: #12191D;
        border-bottom: 1px solid #607D8B;
      }

      .left-navigation-list {
        display: block;
        width: 100%;
        list-style: none;

        .left-navigation-item {
          display: flex;
          align-items: center;
          height: 3.125rem;
          width: 100%;

          a {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0 1.125rem;
            font-family: 'Roboto', sans-serif;
            font-size: 0.75rem;
            color: #90A4AE;
            text-decoration: none;
            text-transform: uppercase;

            svg {
              margin-right: 0.5rem;
            }
          }
        }

        .left-navigation-item-select {
          background-color: #12191D;
        }
      }
    }
  }

  @media screen and (min-width: 969px) {
    width: 12.5rem;

    #left-navigation-bar {
      position: fixed;
      top: 5rem;
      width: 9.375rem;
      height: calc(100vh - 5rem);
    }
  }
`
