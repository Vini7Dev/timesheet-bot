import styled from 'styled-components'

export const TimerTrackerContainer = styled.div`
  width: 100%;
  background-color: #1D272C;
  border: 1px solid #12191D;

  .timer-row {
    display: flex;
    height: 3.75rem;
  }

  .timer-row {
    position: relative;
    padding: 0 0.25rem;
    display: flex;
    align-items: center;

    #timer-project-button {
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

    #timer-billable-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: transparent;
      min-width: 2.5rem;
    }

    #timer-start-stop-button {
      min-width: 5rem;
    }
  }

  @media screen and (min-width: 969px) {
    display: flex;
    padding: 0 0.625rem;

    .timer-row-first {
      width: 100%;
    }
  }
`

export const ProjectPopupContainer = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  z-index: 1;
  padding: 0.625rem;
  margin: 0 0.313rem;
  background-color: #12191D;
  width: 18.75rem;

  #timer-project-popup-results {
    overflow-y: scroll;
    max-height: 14.375rem;
    margin: 0.625rem 0;
    padding-top: 0.625rem;
    border-top: 2px solid #1D272C;

    .timer-project-popup-item {
      padding: 0 0.875rem;
      margin-bottom: 1.125rem;

      .timer-project-popup-customer {
        font-family: 'Roboto', sans-serif;
        font-size: 0.95rem;
        line-height: 1rem;
        color: #90A4AE;
        text-transform: uppercase;
      }

      .timer-project-popup-projects {
        list-style: none;
        padding: 0 0.625rem;

        .timer-project-popup-project {
          cursor: pointer;
          margin-top: 0.875rem;
          font-family: 'Roboto', sans-serif;
          font-size: 0.75rem;
          line-height: 1rem;
          color: #FFF;
        }
      }
    }
  }

  #timer-project-popup-empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.875rem 0;

    #timer-project-popup-empty-text {
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      line-height: 1rem;
      color: #90A4AE;
    }
  }
`
