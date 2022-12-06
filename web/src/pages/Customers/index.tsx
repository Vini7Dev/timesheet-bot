import React from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { Navigation } from '../../components/Navigation'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'
import { FiTrash } from 'react-icons/fi'
import { Button } from '../../components/Button'

export const Customers: React.FC = () => {
  return (
    <PageContainer>
      <TopBar />

      <div id="customers-page-content">
        <Navigation />

        <MainContent>
          <div id="customer-list-container">
            <div id="customer-list-head">
              <strong id="customer-list-title">Clientes</strong>

              <div id="create-customer-button">
                <Button text="Cadastrar projeto" />
              </div>
            </div>

            <div className="customers-group">
              <div className="customers-group-header">
                <span className="customers-group-label">Cliente / Identificador</span>
              </div>

              <div className="customers-group-list">
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
              </div>
            </div>
          </div>
        </MainContent>
      </div>
    </PageContainer>
  )
}

const ProjectItem: React.FC = () => {
  return (
    <ProjectItemContainer>
      <div className="customer-row">
        <Input placeholder="Ambev" inputStyle="high" />

        <Input placeholder="XYZ987" inputStyle="high" />
      </div>

      <button className="remove-project">
        <FiTrash size={20} color="#C53030" />
      </button>
    </ProjectItemContainer>
  )
}
