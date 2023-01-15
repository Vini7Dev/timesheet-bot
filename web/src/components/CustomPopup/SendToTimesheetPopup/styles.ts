import styled from 'styled-components'

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
    padding: 0.625rem 0;

    input {
      margin-right: 0.5rem;
    }

    .popup-marking-data {
      display: flex;
      justify-content: center;
      align-items: center;

      span, p {
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        color: #C6D2D9;
      }

      span {
        margin-right: 0.25rem;
        font-weight: 600;
      }
    }
  }

  .popup-button-margin-top {
    margin-top: 1rem;
  }
`
