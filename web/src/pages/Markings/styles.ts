import styled from 'styled-components'

export const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 5rem);

  #markings-page-content {
    display: block;
    width: 100%;
  }

  @media screen and (min-width: 969px) {
    width: calc(100vw - 1.875rem);

    #markings-page-content {
    display: flex;
    }
  }
`

export const MainContent = styled.main`
  margin-top: 1.125rem;
  width: 100%;

  #marking-list-container {
    margin-top: 1.5rem;

    #marking-list-head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      #marking-list-title {
        display: block;
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        color: #FFF;
        margin: 1.5rem 1.25rem 1.25rem;
      }

      #send-timesheet-button {
        max-width: 12.5rem;
        width: 100%;
        margin-right: 1.25rem;
      }
    }

    .markings-day-group {
      background-color: #1D272C;
      margin-bottom: 1rem;

      .markings-day-group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.625rem 1.25rem;
        border: 1px solid #12191D;
        background-color: #12191D;

        .markings-day-group-date {
          font-family: 'Roboto', sans-serif;
          font-size: 0.8571rem;
          color: #90A4AE;
        }

        .markings-day-group-total {
          font-family: 'Roboto', sans-serif;
          font-size: 1.286rem;
          color: #C6D2D9;
        }
      }

      .marking-day-group-list {
        border: 1px solid #12191D;
      }
    }
  }
`

export const SendToTimesheetPopupContainer = styled.div`
  #popup-form-title,
  #popup-form-subtitle {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
  }

  #popup-form-title {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  #popup-form-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    color: #C6D2D9;
  }

  .popup-marking-container {
    display: flex;
    padding: 10px 0;

    input {
      margin-right: 8px;
    }

    .popup-marking-data p {
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: normal;
      color: #C6D2D9;
    }
  }

  .popup-button-margin-top {
    margin-top: 1rem;
  }
`
