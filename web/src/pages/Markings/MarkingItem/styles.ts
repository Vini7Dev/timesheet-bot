import styled, { css } from 'styled-components'

interface IMarkingItemContainerProps {
  onTimesheetStatus: OnTimesheetStatus
  timesheetDeletionIsPending: boolean
}

export const MarkingItemContainer = styled.div<IMarkingItemContainerProps>`
  ${({ timesheetDeletionIsPending }) => (
    timesheetDeletionIsPending &&
    css`
      opacity: 0.5;
      text-decoration: line-through !important;
    `
  )}

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

      .sending-icon {
        -webkit-animation: rotating 1.5s linear infinite;
        -moz-animation: rotating 1.5s linear infinite;
        -ms-animation: rotating 1.5s linear infinite;
        -o-animation: rotating 1.5s linear infinite;
        animation: rotating 1.5s linear infinite;
      }
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
      padding: 0 0.75rem 0 0.023rem;
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
