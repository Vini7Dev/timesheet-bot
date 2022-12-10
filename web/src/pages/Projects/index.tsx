import React, { useCallback, useEffect, useState } from 'react'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'
import { FiTrash } from 'react-icons/fi'
import { Button } from '../../components/Button'
import { CreateCustomerPopup, CreateProjectPopup, CustomPopup } from '../../components/CustomPopup'
import { TimeTracker } from '../../components/TimeTracker'
import { PROJECTS } from '../../graphql/getProjects'
import { useApolloClient } from '@apollo/client'
import { useToast } from '../../hooks/toast'
import { EmptyListAlert } from '../../components/EmptyListAlert'
import { DELETE_PROJECT } from '../../graphql/deleteProject'

type PopupContentToShow = 'projects' | 'customers'

interface IProjectProps {
  id: string
  code: string
  name: string
  customer: {
    id: string
    name: string
  }
}

interface IGetProjectsResponse {
  projects: IProjectProps[]
}

interface IProjectItemProps extends IProjectProps {
  onDelete: (id: string) => Promise<void>
}

export const Projects: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>('projects')

  const [projects, setProjects] = useState<IProjectProps[]>([])

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

  const handleGetProjects = useCallback(async () => {
    const { data: projectsResponse, errors } = await client.query<IGetProjectsResponse>({
      query: PROJECTS,
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
      setProjects(projectsResponse.projects)
    }
  }, [client, toast])

  const handleDeleteProject = useCallback(async (id: string) => {
    const response = confirm('Deseja apagar o projeto? Essa ação não pode ser desfeita!')

    if (!response) {
      return
    }

    const { errors } = await client.mutate<{ deleteProject: string }>({
      mutation: DELETE_PROJECT, variables: { deleteProjectId: id }
    })

    if (errors && errors.length > 0) {
      for (const error of errors) {
        toast.addToast({
          type: 'error',
          message: error.message
        })
      }
    } else {
      await handleGetProjects()
    }
  }, [client, handleGetProjects, toast])

  const handleReloadProjects = useCallback(async () => {
    handleGetProjects()

    toggleShowCreateProjectForm()
  }, [handleGetProjects, toggleShowCreateProjectForm])

  useEffect(() => {
    handleGetProjects()
  }, [handleGetProjects])

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
              {
                  projects.length > 0
                    ? projects.map(({ id, code, name, customer }) => (
                      <ProjectItem
                        key={id}
                        id={id}
                        code={code}
                        name={name}
                        customer={customer}
                        onDelete={handleDeleteProject}
                      />
                    ))
                    : <EmptyListAlert alertButton={{
                      buttonText: 'Cadastrar projeto',
                      onClick: toggleShowCreateProjectForm
                    }} />
                }
              </div>
            </div>
          </div>
        </MainContent>
      </div>

      {
        showCreateProjectForm && (
          <CustomPopup onClickToClose={toggleShowCreatePopupForm}>
            {
              popupContentToShow === 'projects'
                ? (
                  <CreateProjectPopup
                    onSelectCreateCustomer={() => handleChangePopupContentToShow('customers')}
                    afterSubmit={handleReloadProjects}
                  />
                  )
                : (
                  <CreateCustomerPopup
                    afterSubmit={handleReloadProjects}
                  />
                  )
            }
          </CustomPopup>
        )
      }
    </PageContainer>
  )
}

const ProjectItem: React.FC<IProjectItemProps> = ({
  id,
  code,
  name,
  customer,
  onDelete
}) => {
  const [customerPopupIsOpen, setCustomerPopupIsOpen] = useState(false)

  const toggleCustomerPopupIsOpen = useCallback(() => {
    setCustomerPopupIsOpen(!customerPopupIsOpen)
  }, [customerPopupIsOpen])

  return (
    <ProjectItemContainer>
      <div className="project-row">
        <Input placeholder={name} inputStyle="high" />

        <Input placeholder={code} inputStyle="high" />

        <button
          className="project-project-button"
          onClick={toggleCustomerPopupIsOpen}
        >
          {customer.name}
        </button>

        { customerPopupIsOpen && <SelectPopup popupType="customers" /> }
      </div>

      <button className="remove-project" onClick={async () => await onDelete(id)}>
        <FiTrash size={20} color="#C53030" />
      </button>
    </ProjectItemContainer>
  )
}
