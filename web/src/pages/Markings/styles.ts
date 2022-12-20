import styled from 'styled-components'

type OnTimesheetStatus = 'SENT' | 'NOT_SENT' | 'ERROR'

interface IMarkingItemContainerProps {
  onTimesheetStatus: OnTimesheetStatus
}

interface IPopupContentFormContainerProps {
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


  .marking-row-second {
    justify-content: space-between;
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

    .marking-row-first-column {
      display: flex;
    }

    .marking-row-second-column {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 5.313rem;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      color: #C6D2D9;
      padding: 0 0.75rem 0 0.375px;
    }

    .marking-billable-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: transparent;
      min-width: 2.5rem;
    }

    .marking-time-inputs {
      display: flex;
      align-items: center;
      max-width: 25rem;
      height: 1.563rem;
    }

    .marking-time-total {
      display: flex;
      align-items: center;

      svg {
        margin-right: 0.375rem;
      }
    }

    .marking-more-options button {
      display: flex;
      align-items: center;
      background: none;
      border: none;
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

      .marking-project-button {
        width: fit-content;
        min-width: fit-content;
      }

      .marking-row-second-column {
        margin-left: 1.25rem;
      }
    }
  }

`

export const PopupContentFormContainer = styled.form<IPopupContentFormContainerProps>`
  #popup-form-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .popup-marking-row {
    display: flex;
    align-items: center;
    height: 60px;
    margin: 1rem 0;
  }

  .popup-marking-first-row {
    #marking-timesheet-status {
      display: flex;
      align-items: center;
      padding: 6px 8px;
      font-family: 'Roboto', sans-serif;
      background: none;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 4px;
      border: 1px solid ${({ onTimesheetStatus }) => {
        switch (onTimesheetStatus) {
          case 'SENT': return '#4CAF50'
          case 'NOT_SENT': return '#FFC107'
          case 'ERROR': return '#F44336'
          default: return '#F44336'
        }
      }};
      color: ${({ onTimesheetStatus }) => {
        switch (onTimesheetStatus) {
          case 'SENT': return '#4CAF50'
          case 'NOT_SENT': return '#FFC107'
          case 'ERROR': return '#F44336'
          default: return '#F44336'
        }
      }};

      svg {
        margin-right: 8px;
      }
    }
  }

  .popup-marking-second-row,
  .popup-marking-third-row {
    border: 1px solid #12191D;
  }

  .popup-marking-second-row {
    position: relative;

    .marking-project-button {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 12px;
      border: none;
      background-color: transparent;
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      line-height: 1.5rem;
      color: #008BEA;
      text-decoration: underline;
    }
  }

  .popup-marking-third-row {
    padding: 0 12px;

    .marking-billable-button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1rem;
      border: none;
      background-color: transparent;
    }

    .marking-times-start-end {
      margin-right: 1rem;
    }

    .marking-times-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .marking-times-text {
        margin-left: 5px;
        font-family: 'Roboto', sans-serif;
        font-size: 0.9rem;
        color: #C6D2D9;
      }

      .marking-time-inputs {
        display: flex;
        align-items: center;
        height: 20px;

        .marking-time-inputs-divisor {
          margin: 0 8px;
        }
      }
    }

    .marking-time-total {
      display: flex;
      align-items: center;
      margin-left: auto;
      font-family: 'Roboto',sans-serif;
      font-size: 1rem;
      color: #C6D2D9;

      svg {
        margin-right: 0.375rem;
      }
    }
  }

  #popup-button-margin-top {
    margin-top: 1.5rem;
  }

  @media screen and (max-width: 469px) {
    .popup-marking-row {
      flex-wrap: wrap;
      height: fit-content;
    }
  }
`
