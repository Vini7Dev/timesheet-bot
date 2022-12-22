import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'

import { useToast } from '../../../hooks/toast'
import { CUSTOMERS } from '../../../graphql/getCustomers'
import { CREATE_PROJECT } from '../../../graphql/createProject'
import { Select } from '../../Select'
import { Input } from '../../Input'
import { Button } from '../../Button'
import { CreateProjectForm } from './styles'

interface ICreateProjectResponse {
  createProject: IProjectProps
}

interface IGetCustomersResponse {
  customers: ICustomerProps[]
}

interface ICreateProjectPopupProps {
  customersList?: ICustomerProps[]
  afterSubmit: (response: IProjectProps) => void
  onSelectCreateCustomer: () => void
}

export const CreateProjectPopup: React.FC<ICreateProjectPopupProps> = ({
  customersList,
  afterSubmit,
  onSelectCreateCustomer
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [customerId, setCustomerId] = useState('')

  const [createIsLoading, setCreateIsLoading] = useState(false)
  const [customers, setCustomers] = useState<ICustomerProps[]>(customersList ?? [])

  const handleCreateProject = useCallback(async () => {
    setCreateIsLoading(true)

    const {
      data: createProjectResponse,
      errors
    } = await client.mutate<ICreateProjectResponse>({
      mutation: CREATE_PROJECT,
      variables: {
        data: {
          code,
          name,
          customer_id: customerId
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
      afterSubmit(createProjectResponse?.createProject as IProjectProps)
    }

    setCreateIsLoading(false)
  }, [afterSubmit, client, code, customerId, name, toast])

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
    <CreateProjectForm>
      <h1 id="form-title">Cadastrar projeto</h1>

      <div className="input-margin-bottom">
        <Select
          options={
            [
              { value: '', label: 'Selecione um cliente' },
              ...customers.map(({ id, name }) => ({
                value: id,
                label: name.toUpperCase()
              }))
            ]
          }
          onChange={(e) => setCustomerId(e.target.value)}
        />

        <span id="create-customer-link" onClick={onSelectCreateCustomer}>
          Cadastrar um novo cliente
        </span>
      </div>

      <div className="input-margin-bottom">
        <Input
          placeholder="Código do projeto no multidados"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="input-margin-bottom">
        <Input
          placeholder="Nome do projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="button-margin-top">
        <Button
          text="Cadastrar"
          onClick={handleCreateProject}
          isLoading={createIsLoading}
        />
      </div>
    </CreateProjectForm>
  )
}
