import React, { useCallback, useState } from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { Navigation } from '../../components/Navigation'
import { MainContent, CustomerItemContainer, PageContainer } from './styles'
import { FiTrash } from 'react-icons/fi'
import { Button } from '../../components/Button'
import { CreateCustomerPopup, CustomPopup } from '../../components/CustomPopup'
import { TimeTracker } from '../../components/TimeTracker'

export const Customers: React.FC = () => {
  const [showCreateCustomerForm, setShowCreateCustomerForm] = useState(false)

  const toggleShowCreateCustomerForm = useCallback(() => {
    setShowCreateCustomerForm(!showCreateCustomerForm)
  }, [showCreateCustomerForm])

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
                <CustomerItem />
                <CustomerItem />
                <CustomerItem />
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

const CustomerItem: React.FC = () => {
  return (
    <CustomerItemContainer>
      <div className="customer-row">
        <Input placeholder="Ambev" inputStyle="high" />

        <Input placeholder="XYZ987" inputStyle="high" />
      </div>

      <button className="remove-project">
        <FiTrash size={20} color="#C53030" />
      </button>
    </CustomerItemContainer>
  )
}
