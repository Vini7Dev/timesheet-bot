import React, { useCallback, useState } from 'react'

import { Input } from '../Input'
import { Button } from '../Button'
import { CreateProjectOrCustomerForm, SelectPopupContainer } from './styles'
import { CustomPopup } from '../CustomPopup'
import { Select } from '../Select'

type PopupContentToShow = 'projects' | 'customers'

interface ISelectPopupProps {
  popupType: PopupContentToShow
}

interface ICreateProjectPopupProps {
  onSubmit: () => void
  onSelectCreateCustomer: () => void
}

interface ICreateCustomerPopupProps {
  onSubmit: () => void
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
          <CustomPopup>
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

const CreateProjectPopup: React.FC<ICreateProjectPopupProps> = ({
  onSubmit,
  onSelectCreateCustomer
}) => {
  return (
    <CreateProjectOrCustomerForm>
      <h1 id="form-title">Cadastrar projeto</h1>

      <div className="input-margin-bottom">
        <Select
          options={[
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' }
          ]}
        />

        <span id="create-customer-link" onClick={onSelectCreateCustomer}>
          Cadastrar um novo cliente
        </span>
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Código do projeto no multidados" />
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Nome do projeto" />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={onSubmit} />
      </div>
    </CreateProjectOrCustomerForm>
  )
}

const CreateCustomerPopup: React.FC<ICreateCustomerPopupProps> = ({
  onSubmit
}) => {
  return (
    <CreateProjectOrCustomerForm>
      <h1 id="form-title">Cadastrar cliente</h1>

      <div className="input-margin-bottom">
        <Input placeholder="Código do projeto no multidados" />
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Nome do projeto" />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={onSubmit} />
      </div>
    </CreateProjectOrCustomerForm>
  )
}
