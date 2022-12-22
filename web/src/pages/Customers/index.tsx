import React, { useCallback, useEffect, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { useApolloClient } from '@apollo/client'

import { CUSTOMERS } from '../../graphql/getCustomers'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { Navigation } from '../../components/Navigation'
import { Button } from '../../components/Button'
import { TimeTracker } from '../../components/TimeTracker'
import { CustomPopup } from '../../components/CustomPopup'
import { MainContent, CustomerItemContainer, PageContainer } from './styles'
import { useToast } from '../../hooks/toast'
import { ListAlert } from '../../components/ListAlert'
import { DELETE_CUSTOMER } from '../../graphql/deleteCustomer'
import { UPDATE_CUSTOMER } from '../../graphql/updateCustomer'
import { CreateCustomerPopup } from '../../components/CustomPopup/CreateCustomerPopup'

interface IGetCustomersResponse {
  customers: ICustomerProps[]
}

interface IUpdateCustomerProps {
  customer_id: string
  code?: string
  name?: string
}

interface ICustomerItemProps extends ICustomerProps {
  onDelete: (id: string) => Promise<void>
  onUpdate: (data: IUpdateCustomerProps) => Promise<void>
}

export const Customers: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [customers, setCustomers] = useState<ICustomerProps[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false)

  const toggleShowCreateCustomerForm = useCallback(() => {
    setShowCreateCustomerForm(!showCreateCustomerForm)
  }, [showCreateCustomerForm])

  const handleGetCustomers = useCallback(async () => {
    setLoadingCustomers(true)

    const { data: customersResponse, errors } = await client.query<IGetCustomersResponse>({
      query: CUSTOMERS,
      variables: {
        data: {}
      },
      fetchPolicy: 'no-cache'
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    } else {
      setCustomers(customersResponse.customers)
    }

    setLoadingCustomers(false)
  }, [client, toast])

  const handleReloadCustomers = useCallback(async () => {
    handleGetCustomers()

    toggleShowCreateCustomerForm()
  }, [handleGetCustomers, toggleShowCreateCustomerForm])

  const handleDeleteCustomer = useCallback(async (id: string) => {
    const response = confirm('Deseja apagar o cliente? Essa ação não pode ser desfeita!')

    if (!response) {
      return
    }

    const { errors } = await client.mutate<{ deleteCustomer: string }>({
      mutation: DELETE_CUSTOMER, variables: { deleteCustomerId: id }
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    } else {
      await handleGetCustomers()
    }
  }, [client, handleGetCustomers, toast])

  const handleUpdateCustomer = useCallback(async ({
    customer_id,
    code,
    name
  }: IUpdateCustomerProps) => {
    const {
      errors
    } = await client.mutate({
      mutation: UPDATE_CUSTOMER,
      variables: {
        data: {
          customer_id,
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
    }

    handleGetCustomers()
  }, [client, handleGetCustomers, toast])

  useEffect(() => {
    handleGetCustomers()
  }, [handleGetCustomers])

  return (
    <PageContainer>
      <TopBar />

      <div id="customers-page-content">
        <Navigation />

        <MainContent>
          <TimeTracker />

          <div id="customer-list-container">
            <div id="customer-list-head">
              <strong id="customer-list-title">Clientes</strong>

              <div id="create-customer-button">
                <Button text="Cadastrar cliente" onClick={toggleShowCreateCustomerForm} />
              </div>
            </div>

            <div className="customers-group">
              <div className="customers-group-header">
                <span className="customers-group-label">Cliente / Identificador</span>
              </div>

              <div className="customers-group-list">
                {
                  loadingCustomers
                    ? <ListAlert alertType={'loading'} />
                    : customers.length > 0
                      ? customers.map(({ id, code, name }) => (
                        <CustomerItem
                          key={id}
                          id={id}
                          code={code}
                          name={name}
                          onDelete={handleDeleteCustomer}
                          onUpdate={handleUpdateCustomer}
                        />
                      ))
                      : (<ListAlert
                          alertType={'empty'}
                          alertButton={{
                            buttonText: 'Cadastrar cliente',
                            onClick: toggleShowCreateCustomerForm
                          }}
                        />)
                }
              </div>
            </div>
          </div>
        </MainContent>
      </div>

      {
        showCreateCustomerForm && (
          <CustomPopup onClickToClose={toggleShowCreateCustomerForm}>
            <CreateCustomerPopup
              afterSubmit={handleReloadCustomers}
            />
          </CustomPopup>
        )
      }
    </PageContainer>
  )
}

const CustomerItem: React.FC<ICustomerItemProps> = ({
  id,
  code,
  name,
  onDelete,
  onUpdate
}) => {
  const updateCustomer = useCallback(({
    newName, newCode
  }: {
    newName?: string
    newCode?: string
  }) => {
    if (code === newCode || name === newName) {
      return
    }

    onUpdate({
      customer_id: id,
      code: newCode,
      name: newName
    })
  }, [code, id, name, onUpdate])

  return (
    <CustomerItemContainer>
      <div className="customer-row">
        <Input
          placeholder={name}
          inputStyle="high"
          defaultValue={name}
          onBlur={(e) => updateCustomer({ newName: e.target.value })}
          />

        <Input
          placeholder={code}
          inputStyle="high"
          defaultValue={code}
          onBlur={(e) => updateCustomer({ newCode: e.target.value })}
          />
      </div>

      <button className="remove-project" onClick={async () => await onDelete(id)}>
        <FiTrash size={20} color="#C53030" />
      </button>
    </CustomerItemContainer>
  )
}
