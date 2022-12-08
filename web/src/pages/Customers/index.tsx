import React, { useCallback, useEffect, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { useApolloClient, useQuery } from '@apollo/client'

import { CUSTOMERS } from '../../graphql/getCustomers'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { Navigation } from '../../components/Navigation'
import { Button } from '../../components/Button'
import { TimeTracker } from '../../components/TimeTracker'
import { CreateCustomerPopup, CustomPopup } from '../../components/CustomPopup'
import { MainContent, CustomerItemContainer, PageContainer } from './styles'
import { useToast } from '../../hooks/toast'
import { EmptyListAlert } from '../../components/EmptyListAlert'

interface ICustomerProps {
  id: string
  code: string
  name: string
}

interface IGetCustomersResponse {
  customers: ICustomerProps[]
}

export const Customers: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [customers, setCustomers] = useState<ICustomerProps[]>([])

  const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false)

  const toggleShowCreateCustomerForm = useCallback(() => {
    setShowCreateCustomerForm(!showCreateCustomerForm)
  }, [showCreateCustomerForm])

  const handleGetCustomers = useCallback(async () => {
    const { data: customersResponse, errors } = await client.query<IGetCustomersResponse>({
      query: CUSTOMERS,
      variables: {
        data: {}
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
      setCustomers(customersResponse.customers)
    }
  }, [client, toast])

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
                  customers.length > 0
                    ? customers.map(({ id, code, name }) => (
                      <CustomerItem key={id} id={id} code={code} name={name} />
                    ))
                    : <EmptyListAlert alertButton={{
                      buttonText: 'Cadastrar cliente',
                      onClick: toggleShowCreateCustomerForm
                    }} />
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
              onSubmit={toggleShowCreateCustomerForm}
            />
          </CustomPopup>
        )
      }
    </PageContainer>
  )
}

const CustomerItem: React.FC<ICustomerProps> = ({
  id,
  code,
  name
}) => {
  return (
    <CustomerItemContainer>
      <div className="customer-row">
        <Input placeholder={name} inputStyle="high" />

        <Input placeholder={code} inputStyle="high" />
      </div>

      <button className="remove-project">
        <FiTrash size={20} color="#C53030" />
      </button>
    </CustomerItemContainer>
  )
}
