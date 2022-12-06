import styled from 'styled-components'

export const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);

  #projects-page-content {
    display: block;
    width: 100%;
  }

  @media screen and (min-width: 969px) {
    width: calc(100vw - 30px);

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

    #project-list-title {
      display: block;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #FFF;
      margin: 1.5rem 10px 20px;
    }

    .projects-customer-group {
      background-color: #1D272C;

      .projects-customer-group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border: 1px solid #12191D;
        background-color: #12191D;

        .projects-customer-group-name {
          font-family: 'Roboto', sans-serif;
          font-size: 1.286rem;
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
  border: 1px solid #12191D;

  .project-row {
    position: relative;
    border: 1px solid #12191D;
    display: flex;
    align-items: center;
    height: 4rem;

    .project-timesheet-status {
      margin-top: 5px;
      border: none;
      background-color: transparent;
    }

    .project-project-button {
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

    .project-billable-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: transparent;
      min-width: 2.5rem;
    }

    .project-times-container {
      .project-times-text {
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        color: #C6D2D9;
        padding-left: 12px;
      }

      .project-time-inputs {
        display: flex;
        align-items: center;
        max-width: 400px;
        height: 25px;
      }
    }

    .project-times-pause {
      margin-left: auto;
    }

    .project-time-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 70px;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #C6D2D9;
      padding: 0 12px 0 6px;
    }
  }

  @media screen and (min-width: 969px) {
    display: flex;
    padding: 0 0.625rem;

    .project-row {
      width: 100%;
    }

    .project-row {
      border: none;

      .project-times-container {
        max-width: 250px;
      }
    }
  }

`
