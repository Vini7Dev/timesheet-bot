import styled from 'styled-components'

export const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);

  #customers-page-content {
    display: block;
    width: 100%;
  }

  @media screen and (min-width: 969px) {
    width: calc(100vw - 30px);

    #customers-page-content {
    display: flex;
    }
  }
`

export const MainContent = styled.main`
  margin-top: 1.125rem;
  width: 100%;

  #customer-list-container {
    margin-top: 1.5rem;

    #customer-list-title {
      display: block;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #FFF;
      margin: 1.5rem 10px 20px;
    }

    .customers-group {
      background-color: #1D272C;

      .customer-group-list {
        border: 1px solid #12191D;
      }

      .customers-group-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px 20px;
        border: 1px solid #12191D;
        background-color: #12191D;

        .customers-group-label {
          margin-top: 8px;
          font-family: 'Roboto', sans-serif;
          font-size: 1rem;
          color: #C6D2D9;
        }
      }
    }
  }
`

export const ProjectItemContainer = styled.div`
  position: relative;
  border: 1px solid #12191D;

  .customer-row {
    position: relative;
    border: 1px solid #12191D;
    display: flex;
    align-items: center;
    height: 4rem;
  }

  .remove-project {
    position: absolute;
    right: 12px;
    top: 22px;
    background: none;
    border: none;
  }

  @media screen and (min-width: 969px) {
    display: flex;
    padding: 0 0.625rem;

    .customer-row {
      width: 100%;
      border: none;
    }
  }
`
