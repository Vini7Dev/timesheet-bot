import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0 3rem;

  #pagination-buttons-container {
    display: flex;
    margin-right: 1rem;

    .pagination-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2.375rem;
      height: 2.375rem;
      color: #C6D2D9;
      background-color: #1D272C;
      border: 1px solid #12191d;
    }

    .pagination-button-disabled {
      cursor: default;
      opacity: 0.45;
    }

    .pagination-input {
      width: 3.625rem;
      margin: 0 0.5rem;


      input {
        text-align: center;
      }
    }
  }

  #per-page-select-container {
    display: flex;
    align-items: center;

    & > div {
      width: 4.75rem;
    }

    span {
      display: block;
      margin-left: 0.7rem;

      font-family: 'Roboto',sans-serif;
      font-size: 0.9rem;
      font-weight: normal;
      color: #C6D2D9;
    }
  }
`
