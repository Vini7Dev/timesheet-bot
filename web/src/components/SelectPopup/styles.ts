import styled from 'styled-components'

export const SelectPopupContainer = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  z-index: 1;
  padding: 0.625rem;
  margin: 0 0.313rem;
  background-color: #12191D;
  width: 18.75rem;

  #popup-results {
    overflow-y: scroll;
    max-height: 14.375rem;
    margin: 0.625rem 0;
    padding-top: 0.625rem;
    border-top: 2px solid #1D272C;

    .popup-item {
      padding: 0 0.875rem;
      margin-bottom: 1.125rem;

      .project-popup-customer {
        font-family: 'Roboto', sans-serif;
        font-size: 0.95rem;
        line-height: 1rem;
        color: #90A4AE;
        text-transform: uppercase;
      }

      .project-popup-projects,
      .customers-popup-list {
        list-style: none;
        padding: 0 0.625rem;

        .project-popup-project,
        .customer-popup-name {
          cursor: pointer;
          margin-top: 0.875rem;
          font-family: 'Roboto', sans-serif;
          font-size: 0.75rem;
          line-height: 1rem;
          color: #FFF;
        }
      }

      .project-popup-projects {
        margin-bottom: 0.5rem;
      }
    }
  }

  #popup-empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.875rem 0;

    #popup-empty-text {
      font-family: 'Roboto', sans-serif;
      font-size: 0.95rem;
      line-height: 1rem;
      color: #90A4AE;
    }
  }
`
