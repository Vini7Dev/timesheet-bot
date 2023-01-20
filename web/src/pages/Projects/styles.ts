import styled from 'styled-components'

export const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);

  #projects-page-content {
    display: block;
    width: 100%;
  }

  @media screen and (min-width: 969px) {
    width: calc(100vw - 1.875rem);

    #projects-page-content {
    display: flex;
    }
  }
`

export const MainContent = styled.main`
  margin-top: 1.125rem;
  width: 100%;

  #project-list-container {
    margin-top: 1.5rem;

    #project-list-head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      #project-list-title {
        display: block;
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        color: #FFF;
        margin: 1.5rem 1.25rem 1.25rem;
      }

      #create-project-button {
        max-width: 12.5rem;
        width: 100%;
        margin-right: 1.25rem;
      }
    }

    .projects-customer-group {
      background-color: #1D272C;
      margin-bottom: 1rem;

      .projects-customer-group-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.625rem 1.25rem;
        border: 1px solid #12191D;
        background-color: #12191D;

        .projects-customer-group-name {
          font-family: 'Roboto', sans-serif;
          font-size: 1rem;
          color: #C6D2D9;

          span {
            font-weight: 700;
            letter-spacing: 0.05rem;
          }
        }

        .projects-customer-group-label {
          margin-top: 0.5rem;
          font-family: 'Roboto', sans-serif;
          font-size: 1rem;
          color: #C6D2D9;
        }
      }

      .project-customer-group-list {
        border: 1px solid #12191D;
      }
    }
  }
`

export const ProjectItemContainer = styled.div`
  position: relative;
  border: 1px solid #12191D;

  .project-row {
    position: relative;
    border: 1px solid #12191D;
    display: flex;
    align-items: center;
    height: 4rem;

    .project-select-project-or-customer-button {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 5rem;
      border: none;
      background-color: transparent;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      line-height: 1.5rem;
      color: #008BEA;
      text-decoration: underline;
    }
  }

  .remove-project {
    position: absolute;
    right: 0;
    top: 0;
    background: none;
    border: none;
  }

  @media screen and (min-width: 969px) {
    display: flex;
    padding: 0 0.625rem;

    .project-row {
      width: 100%;
    }

    .project-row {
      border: none;
    }
  }
`
