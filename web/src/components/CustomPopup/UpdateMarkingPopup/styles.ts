import styled from 'styled-components'

interface IUpdateMarkingPopupFormProps {
  onTimesheetStatus: OnTimesheetStatus
}

export const UpdateMarkingPopupForm = styled.form<IUpdateMarkingPopupFormProps>`
  #popup-form-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .popup-marking-row {
    display: flex;
    align-items: center;
    height: 3.75rem;
    margin: 1rem 0;
  }

  .popup-marking-first-row {
    #marking-timesheet-status {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.5rem;
      font-family: 'Roboto', sans-serif;
      text-align: left;
      background: none;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 0.25rem;
      border: 1px solid ${({ onTimesheetStatus }) => {
        switch (onTimesheetStatus) {
          case 'SENT': return '#4CAF50'
          case 'SENDING': return '#008BEA'
          case 'NOT_SENT': return '#FFC107'
          case 'ERROR': return '#F44336'
          default: return '#F44336'
        }
      }};
      color: ${({ onTimesheetStatus }) => {
        switch (onTimesheetStatus) {
          case 'SENT': return '#4CAF50'
          case 'SENDING': return '#008BEA'
          case 'NOT_SENT': return '#FFC107'
          case 'ERROR': return '#F44336'
          default: return '#F44336'
        }
      }};

      svg {
        margin-right: 0.5rem;
      }

      .sending-icon {
        -webkit-animation: rotating 1.5s linear infinite;
        -moz-animation: rotating 1.5s linear infinite;
        -ms-animation: rotating 1.5s linear infinite;
        -o-animation: rotating 1.5s linear infinite;
        animation: rotating 1.5s linear infinite;
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
      padding: 0 0.75rem;
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
    padding: 0 0.75rem;

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
        margin-left: 0.313rem;
        font-family: 'Roboto', sans-serif;
        font-size: 0.9rem;
        color: #C6D2D9;
      }

      .marking-time-inputs {
        display: flex;
        align-items: center;
        height: 1.25rem;

        .marking-time-inputs-divisor {
          margin: 0 0.5rem;
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

  .popup-button-margin-top {
    margin-top: 1rem;
  }

  .popup-button-small {
    max-width: 6.25rem;
    margin-left: auto;
  }

  @media screen and (max-width: 469px) {
    .popup-marking-row {
      flex-wrap: wrap;
      height: fit-content;
    }
  }
`
