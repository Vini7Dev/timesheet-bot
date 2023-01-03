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
    padding: 10px 0;

    input {
      margin-right: 8px;
    }

    .popup-marking-data p {
      font-family: 'Roboto', sans-serif;
      font-size: 1rem;
      font-weight: normal;
      color: #C6D2D9;
    }
  }

  .popup-button-margin-top {
    margin-top: 1rem;
  }
`
