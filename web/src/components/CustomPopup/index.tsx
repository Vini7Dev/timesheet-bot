import React from 'react'
import { FiX } from 'react-icons/fi'

import { Button } from '../Button'
import { Input } from '../Input'
import { Select } from '../Select'
import { CreateProjectOrCustomerForm, CustomPopupContainer } from './styles'

interface ICustomPopupProps {
  hideCloseButton?: boolean
  onClickToClose: () => void
}

interface ICreateProjectPopupProps {
  onSubmit: () => void
  onSelectCreateCustomer: () => void
}

interface ICreateCustomerPopupProps {
  onSubmit: () => void
}

export const CustomPopup: React.FC<ICustomPopupProps & any> = ({
  hideCloseButton = false,
  onClickToClose,
  children
}) => {
  return (
    <CustomPopupContainer>
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

export const CreateProjectPopup: React.FC<ICreateProjectPopupProps> = ({
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

export const CreateCustomerPopup: React.FC<ICreateCustomerPopupProps> = ({
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
