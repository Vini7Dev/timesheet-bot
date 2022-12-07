import styled from 'styled-components'

type OnTimesheetStatus = 'SENT' | 'NOT_SENT' | 'ERROR'

interface IMarkingItemContainerProps {
  onTimesheetStatus: OnTimesheetStatus
}

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
    margin-top: 3rem;

    #marking-list-title {
      display: block;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #FFF;
      margin: 1.5rem 1.25rem 1.25rem;
    }

    .markings-day-group {
      background-color: #1D272C;

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

export const MarkingItemContainer = styled.div<IMarkingItemContainerProps>`
  border: 1px solid ${({ onTimesheetStatus }) => {
    switch (onTimesheetStatus) {
      case 'SENT': return '#12191D'
      case 'NOT_SENT': return '#FFC107'
      case 'ERROR': return '#F44336'
      default: return '#F44336'
    }
  }};

  .marking-row-first {
    padding: 0 0.75rem 0;
  }

  .marking-row {
    position: relative;
    border: 1px solid #12191D;
    display: flex;
    align-items: center;
    height: 4rem;

    .marking-timesheet-status {
      margin-top: 0.313rem;
      border: none;
      background-color: transparent;
    }

    .marking-project-button {
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

    .marking-billable-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: transparent;
      min-width: 2.5rem;
    }

    .marking-times-container {
      .marking-times-text {
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        color: #C6D2D9;
        padding-left: 0.75rem;
      }

      .marking-time-inputs {
        display: flex;
        align-items: center;
        max-width: 25rem;
        height: 1.563rem;
      }
    }

    .marking-times-pause {
      margin-left: auto;
    }

    .marking-time-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 4.375rem;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #C6D2D9;
      padding: 0 0.75rem 0 0.375rem;
    }
  }

  @media screen and (min-width: 969px) {
    display: flex;
    padding: 0 0.625rem;

    .marking-row-first {
      width: 100%;
    }

    .marking-row {
      border: none;

      .marking-times-container {
        max-width: 15.625rem;
      }
    }
  }

`
