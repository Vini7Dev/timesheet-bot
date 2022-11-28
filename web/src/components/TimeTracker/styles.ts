import styled from 'styled-components'

export const TimerTrackerContainer = styled.div`
  width: 100%;
  background-color: #1D272C;
  border: 1px solid #12191D;

  .timer-row {
    display: flex;
    height: 60px;
  }

  .timer-row {
    position: relative;
    padding: 0 4px;
    display: flex;
    align-items: center;

    #timer-project-button {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 80px;
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
      min-width: 40px;
    }

    #timer-start-stop-button {
      min-width: 80px;
    }
  }
`

export const ProjectPopupContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 1;
  padding: 10px;
  margin: 0 5px;
  background-color: #12191D;
  width: 300px;

  #timer-project-popup-results {
    overflow-y: scroll;
    max-height: 230px;
    margin: 10px 0;
    padding-top: 10px;
    border-top: 2px solid #1D272C;

    .timer-project-popup-item {
      padding: 0 14px;
      margin-bottom: 18px;

      .timer-project-popup-customer {
        font-family: 'Roboto', sans-serif;
        font-size: 0.95rem;
        line-height: 1rem;
        color: #90A4AE;
        text-transform: uppercase;
      }

      .timer-project-popup-projects {
        list-style: none;
        padding: 0 10px;

        .timer-project-popup-project {
          cursor: pointer;
          margin-top: 14px;
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
    margin: 14px 0;

    #timer-project-popup-empty-text {
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      line-height: 1rem;
      color: #90A4AE;
    }
  }
`
