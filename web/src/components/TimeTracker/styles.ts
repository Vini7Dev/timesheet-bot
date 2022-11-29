import styled from 'styled-components'

export const TimerTrackerContainer = styled.div`
  width: 100%;
  background-color: #1D272C;
  border: 1px solid #12191D;

  .timer-row {
    height: 3.75rem;
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
