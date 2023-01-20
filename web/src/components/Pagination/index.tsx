import React, { useCallback, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Input } from '../Input'

import { Select } from '../Select'
import { PaginationContainer } from './styles'

interface IPaginationProps {
  currentPage: number
  currentPerPage: number
  perPageOptions: number[]
  currentPageResultsCount: number
  onChangeInputPage: (newPage: number) => void
  onNextPage: (nextPage: number) => void
  onPreviousPage: (previousPage: number) => void
  onSelectPerPage: (perPage: number) => void
}

export const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  currentPerPage,
  perPageOptions,
  currentPageResultsCount,
  onChangeInputPage,
  onNextPage,
  onPreviousPage,
  onSelectPerPage
}) => {
  const handleChangeToNewPage = useCallback((newPage: number) => {
    if (newPage <= 0 || newPage === currentPage) {
      return
    }

    onChangeInputPage(newPage)
  }, [onChangeInputPage])

  const handleChangeToNextPage = useCallback(() => {
    onNextPage(currentPage + 1)
  }, [currentPage, onNextPage])

  const handleChangeToPreviousPage = useCallback(() => {
    if (currentPage <= 1) {
      return
    }

    onPreviousPage(currentPage - 1)
  }, [currentPage, onPreviousPage])

  const handleSelectPerPage = useCallback((perPageSelected: number) => {
    if (perPageSelected <= 0) {
      return
    }

    onSelectPerPage(perPageSelected)
  }, [onSelectPerPage])

  return (
    <PaginationContainer>
      <div id="pagination-buttons-container">
        <button
          className={`pagination-button ${
            currentPage === 1 ? 'pagination-button-disabled' : ''
          }`}
          onClick={handleChangeToPreviousPage}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>

        <div className="pagination-input">
          <Input
            placeholder="1"
            value={currentPage}
            onChange={(e) => handleChangeToNewPage(Number(e.target.value))}
          />
        </div>

        <button
          className={`pagination-button ${
            currentPageResultsCount < currentPerPage ? 'pagination-button-disabled' : ''
          }`}
          onClick={handleChangeToNextPage}
          disabled={currentPageResultsCount < currentPerPage}
        >
          <FiChevronRight />
        </button>
      </div>

      <div id="per-page-select-container">
        <Select
          onChange={(e) => handleSelectPerPage(Number(e.target.value))}
          options={perPageOptions.map(perPageOption => ({
            value: perPageOption.toString()
          }))}
        />

        <span>por página</span>
      </div>
    </PaginationContainer>
  )
}
