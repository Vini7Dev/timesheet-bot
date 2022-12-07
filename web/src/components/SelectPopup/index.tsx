import React, { useCallback, useState } from 'react'

import { Input } from '../Input'
import { Button } from '../Button'
import { SelectPopupContainer } from './styles'
import { CustomPopup, CreateProjectPopup, CreateCustomerPopup } from '../CustomPopup'

type PopupContentToShow = 'projects' | 'customers'

interface ISelectPopupProps {
  popupType: PopupContentToShow
}

export const SelectPopup: React.FC<ISelectPopupProps> = ({
  popupType
}) => {
  const [showCreatePopupForm, setShowCreatePopupForm] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>(popupType)

  const toggleShowCreatePopupForm = useCallback(() => {
    setShowCreatePopupForm(!showCreatePopupForm)
    setPopupContentToShow(popupType)
  }, [popupType, showCreatePopupForm])

  const handleChangePopupContentToShow = useCallback((contentToSet: PopupContentToShow) => {
    setPopupContentToShow(contentToSet)
  }, [])

  const handleShowPopup = useCallback((contentToShow: PopupContentToShow) => {
    setPopupContentToShow(contentToShow)
    setShowCreatePopupForm(true)
  }, [])

  return (
    <SelectPopupContainer id="popup-container">
      <Input placeholder="Pesquise..." />

      <div id="popup-results">
        <div id="popup-empty-container">
          <p id="popup-empty-text">
            Sem resultados...
          </p>
        </div>

        <div className="popup-item">
          {
            popupContentToShow === 'projects'
              ? (
                <>
                  <strong className="project-popup-customer">ambev</strong>

                  <ul className="project-popup-projects">
                    <li className="project-popup-project">uauness</li>
                  </ul>
                </>
                )
              : (
                <>
                  <ul className="customers-popup-list">
                    <li className="customer-popup-name">uauness</li>
                    <li className="customer-popup-name">uauness</li>
                    <li className="customer-popup-name">uauness</li>
                  </ul>
                </>
                )
          }
          </div>
      </div>

      <Button
        onClick={() => handleShowPopup(popupContentToShow)}
        text={popupContentToShow === 'projects' ? 'Cadastrar projeto' : 'Cadastrar cliente'}
      />

      {
        showCreatePopupForm && (
          <CustomPopup onClickToClose={toggleShowCreatePopupForm}>
            {
              popupContentToShow === 'projects'
                ? (
                  <CreateProjectPopup
                    onSubmit={toggleShowCreatePopupForm}
                    onSelectCreateCustomer={() => handleChangePopupContentToShow('customers')}
                  />
                  )
                : <CreateCustomerPopup onSubmit={toggleShowCreatePopupForm} />
            }
          </CustomPopup>
        )
      }
    </SelectPopupContainer>
  )
}
