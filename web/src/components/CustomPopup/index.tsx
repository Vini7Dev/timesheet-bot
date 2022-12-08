import { useApolloClient } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { CREATE_CUSTOMER } from '../../graphql/createCustomer'
import { CUSTOMERS } from '../../graphql/getCustomers'
import { useToast } from '../../hooks/toast'

import { Button } from '../Button'
import { Input } from '../Input'
import { Select } from '../Select'
import { CreateProjectOrCustomerForm, CustomPopupContainer } from './styles'

interface ICustomerProps {
  id: string
  code: string
  name: string
}

interface ICreateCustomerResponse {
  createCustomer: ICustomerProps
}

interface IGetCustomersResponse {
  customers: ICustomerProps[]
}

interface ICustomPopupProps {
  hideCloseButton?: boolean
  onClickToClose: () => void
}

interface ICreateProjectPopupProps {
  customersList?: ICustomerProps[]
  onSubmit: () => void
  onSelectCreateCustomer: () => void
}

interface ICreateCustomerPopupProps {
  afterSubmit: (response: ICustomerProps) => void
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
  customersList,
  onSubmit,
  onSelectCreateCustomer
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [customers, setCustomers] = useState<ICustomerProps[]>(customersList ?? [])

  const handleGetCustomers = useCallback(async () => {
    const { data: customersResponse, error } = await client.query<IGetCustomersResponse>({
      query: CUSTOMERS,
      variables: {
        data: {}
      },
      fetchPolicy: 'no-cache'
    })

    if (error) {
      toast.addToast({
        type: 'error',
        message: error.message
      })
    } else {
      setCustomers(customersResponse.customers)
    }
  }, [client, toast])

  useEffect(() => {
    handleGetCustomers()
  }, [handleGetCustomers])

  return (
    <CreateProjectOrCustomerForm>
      <h1 id="form-title">Cadastrar projeto</h1>

      <div className="input-margin-bottom">
        <Select
          options={
            customers.map(({ id, name }) => ({
              value: id,
              label: name.toUpperCase()
            }))
          }
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
  afterSubmit
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const handleCreateCustomer = useCallback(async () => {
    const {
      data: createCustomerResponse,
      errors
    } = await client.mutate<ICreateCustomerResponse>({
      mutation: CREATE_CUSTOMER,
      variables: {
        data: {
          code,
          name
        }
      }
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    } else {
      afterSubmit(createCustomerResponse?.createCustomer as ICustomerProps)
    }
  }, [afterSubmit, client, code, name, toast])

  return (
    <CreateProjectOrCustomerForm>
      <h1 id="form-title">Cadastrar cliente</h1>

      <div className="input-margin-bottom">
        <Input
          placeholder="Nome do projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-margin-bottom">
        <Input
          placeholder="Código do projeto no multidados"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={handleCreateCustomer} />
      </div>
    </CreateProjectOrCustomerForm>
  )
}
