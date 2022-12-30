import React from 'react'
import { FiX } from 'react-icons/fi'

import { CustomPopupContainer } from './styles'

interface ICustomPopupProps {
  hideCloseButton?: boolean
  onClickToClose: () => void
}

export const CustomPopup: React.FC<ICustomPopupProps & any> = ({
  hideCloseButton = false,
  onClickToClose,
  children
}) => {
  return (
    <CustomPopupContainer>
      <div
        className="custom-popup-outside-area"
        onClick={onClickToClose}
      />

      <div className="custom-popup-content-area">
        { children }

        {
          !hideCloseButton && (
            <button id="custom-popup-close-button" onClick={onClickToClose}>
              <FiX size={22} color="#FFFFFF" />
            </button>
          )
        }
      </div>
    </CustomPopupContainer>
  )
}
