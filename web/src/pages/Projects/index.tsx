import React, { useCallback, useState } from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'
import { FiTrash } from 'react-icons/fi'
import { Button } from '../../components/Button'
import { CreateCustomerPopup, CreateProjectPopup, CustomPopup } from '../../components/CustomPopup'
import { TimeTracker } from '../../components/TimeTracker'

type PopupContentToShow = 'projects' | 'customers'

export const Projects: React.FC = () => {
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>('projects')

  const toggleShowCreateProjectForm = useCallback(() => {
    setShowCreateProjectForm(!showCreateProjectForm)
    setPopupContentToShow('projects')
  }, [showCreateProjectForm])

  const handleChangePopupContentToShow = useCallback((contentToSet: PopupContentToShow) => {
    setPopupContentToShow(contentToSet)
  }, [])

  const toggleShowCreatePopupForm = useCallback(() => {
    setShowCreateProjectForm(!showCreateProjectForm)
    setPopupContentToShow('projects')
  }, [showCreateProjectForm])

  return (
    <PageContainer>
      <TopBar />

      <div id="projects-page-content">
        <Navigation />

        <MainContent>
          <TimeTracker />

          <div id="project-list-container">
            <div id="project-list-head">
              <strong id="project-list-title">Projetos</strong>

              <div id="create-project-button">
                <Button text="Cadastrar projeto" onClick={toggleShowCreateProjectForm} />
              </div>
            </div>

            <div className="projects-customer-group">
              <div className="projects-customer-group-header">
                <span className="projects-customer-group-name">Ambev</span>

                <span className="projects-customer-group-label">Projeto / Identificador</span>
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

      {
        showCreateProjectForm && (
          <CustomPopup>
            {
              popupContentToShow === 'projects'
                ? (
                  <CreateProjectPopup
                    onSelectCreateCustomer={() => handleChangePopupContentToShow('customers')}
                    onSubmit={toggleShowCreatePopupForm}
                  />
                  )
                : (
                  <CreateCustomerPopup
                    onSubmit={toggleShowCreatePopupForm}
                  />
                  )
            }
          </CustomPopup>
        )
      }
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
        <Input placeholder="Uauness" inputStyle="high" />

        <Input placeholder="ABC123" inputStyle="high" />

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
