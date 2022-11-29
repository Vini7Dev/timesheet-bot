import React from 'react'

import { CustomPopupContainer } from './styles'

export const CustomPopup: React.FC<any> = ({
  children
}) => {
  return (
    <CustomPopupContainer>
      <div className="custom-popup-content-area">
        { children }
      </div>
    </CustomPopupContainer>
  )
}
