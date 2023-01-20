import React, { useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Input } from '../Input'

import { Select } from '../Select'
import { PaginationContainer } from './styles'

interface IPaginationProps {
  currentPage: number
  perPageOptions: number[]
  onChangeInputPage: (newPage: number) => void
  onNextPage: (nextPage: number) => void
  onPreviousPage: (previousPage: number) => void
  onSelectPerPage: (perPage: number) => void
}

export const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  perPageOptions,
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
        <button className="pagination-button" onClick={handleChangeToPreviousPage}>
          <FiChevronLeft />
        </button>

        <div className="pagination-input">
          <Input
            placeholder="1"
            value={currentPage}
            onChange={(e) => handleChangeToNewPage(Number(e.target.value))}
          />
        </div>

        <button className="pagination-button" onClick={handleChangeToNextPage}>
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
