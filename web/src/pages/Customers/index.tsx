import React from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { Navigation } from '../../components/Navigation'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'

export const Customers: React.FC = () => {
  return (
    <PageContainer>
      <TopBar />

      <div id="customers-page-content">
        <Navigation />

        <MainContent>
          <div id="customer-list-container">
            <strong id="customer-list-title">Clientes</strong>

            <div className="customers-group">
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
        <Input placeholder="Uauness" inputStyle="timer" />

        <Input placeholder="ABC123" inputStyle="timer" />
      </div>
    </ProjectItemContainer>
  )
}
