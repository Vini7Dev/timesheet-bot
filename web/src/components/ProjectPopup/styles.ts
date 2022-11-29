import styled from 'styled-components'

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
