import React, { useCallback, useState } from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'
import { FiTrash } from 'react-icons/fi'

export const Projects: React.FC = () => {
  return (
    <PageContainer>
      <TopBar />

      <div id="projects-page-content">
        <Navigation />

        <MainContent>
          <div id="project-list-container">
            <strong id="project-list-title">Projetos</strong>

            <div className="projects-customer-group">
              <div className="projects-customer-group-header">
                <span className="projects-customer-group-name">Ambev</span>
              </div>

              <div className="project-customer-group-list">
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
  const [customerPopupIsOpen, setCustomerPopupIsOpen] = useState(false)

  const toggleCustomerPopupIsOpen = useCallback(() => {
    setCustomerPopupIsOpen(!customerPopupIsOpen)
  }, [customerPopupIsOpen])

  return (
    <ProjectItemContainer>
      <div className="project-row">
        <Input placeholder="Uauness" inputStyle="timer" />

        <Input placeholder="ABC123" inputStyle="timer" />

        <button
          className="project-project-button"
          onClick={toggleCustomerPopupIsOpen}
        >
          + Cliente
        </button>

        { customerPopupIsOpen && <SelectPopup popupType="customers" /> }
      </div>

      <button className="remove-project">
        <FiTrash size={20} color="#C53030" />
      </button>
    </ProjectItemContainer>
  )
}
