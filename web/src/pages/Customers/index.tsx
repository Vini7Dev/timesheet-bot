import React, { useCallback, useEffect, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { useApolloClient } from '@apollo/client'
import * as Yup from 'yup'

import { CUSTOMERS } from '../../graphql/getCustomers'
import { yupFormValidator } from '../../utils/yupFormValidator'
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

interface IHandleUpdateCustomerProps {
  newName?: string
  newCode?: string
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

    try {
      const { data: customersResponse } = await client.query<IGetCustomersResponse>({
        query: CUSTOMERS,
        variables: {
          data: {}
        },
        fetchPolicy: 'no-cache'
      })

      setCustomers(customersResponse.customers)
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setLoadingCustomers(false)
  }, [client])

  const handleReloadCustomers = useCallback(async () => {
    handleGetCustomers()

    toggleShowCreateCustomerForm()
  }, [handleGetCustomers, toggleShowCreateCustomerForm])

  const handleDeleteCustomer = useCallback(async (id: string) => {
    const response = confirm('Deseja apagar o cliente? Essa ação não pode ser desfeita!')

    if (!response) {
      return
    }

    try {
      await client.mutate<{ deleteCustomer: string }>({
        mutation: DELETE_CUSTOMER, variables: { deleteCustomerId: id }
      })

      await handleGetCustomers()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, handleGetCustomers])

  const handleUpdateCustomer = useCallback(async ({
    customer_id,
    code,
    name
  }: IUpdateCustomerProps) => {
    const customerData = {
      customer_id,
      code,
      name
    }

    const schema = Yup.object().shape({
      customer_id: Yup.string().uuid('UUID invalido').required('Não foi possível recuperar o ID do cliente!'),
      code: Yup.string().min(1, 'O código não pode estar vazio!'),
      name: Yup.string().min(1, 'O nome não pode estar vazio!')
    })

    const isValid = await yupFormValidator({
      schema,
      data: customerData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    try {
      await client.mutate({
        mutation: UPDATE_CUSTOMER,
        variables: {
          data: customerData
        }
      })

      handleGetCustomers()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, handleGetCustomers])

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
  const handleUpdateCustomer = useCallback(({
    newName, newCode
  }: IHandleUpdateCustomerProps) => {
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
          onBlur={(e) => handleUpdateCustomer({ newName: e.target.value })}
          />

        <Input
          placeholder={code}
          inputStyle="high"
          defaultValue={code}
          onBlur={(e) => handleUpdateCustomer({ newCode: e.target.value })}
          />
      </div>

      <button className="remove-project" onClick={async () => await onDelete(id)}>
        <FiTrash size={20} color="#C53030" />
      </button>
    </CustomerItemContainer>
  )
}
