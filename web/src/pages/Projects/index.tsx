import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiTrash } from 'react-icons/fi'

import { useToast } from '../../hooks/toast'
import { PROJECTS_GROUP_BY_CUSTOMERS } from '../../graphql/getProjectsGroupByCustomers'
import { DELETE_PROJECT } from '../../graphql/deleteProject'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { Button } from '../../components/Button'
import { TimeTracker } from '../../components/TimeTracker'
import { ListAlert } from '../../components/ListAlert'
import { CreateCustomerPopup, CreateProjectPopup, CustomPopup } from '../../components/CustomPopup'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'

type PopupContentToShow = 'projects' | 'customers'

interface IProjectProps {
  id: string
  code: string
  name: string
}

interface IProectsByCustomerProps {
  id: string
  name: string
  projects: IProjectProps[]
}

interface IGetProjectsGroupByCustomersResponse {
  customers: IProectsByCustomerProps[]
}

interface IProjectItemProps extends IProjectProps {
  customerName: string
  onDelete: (id: string) => Promise<void>
}

export const Projects: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>('projects')
  const [projectsByCustomers, setProjectsByCustomers] = useState<IProectsByCustomerProps[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  const toggleShowCreateProjectForm = useCallback(() => {
    setShowCreateProjectForm(!showCreateProjectForm)
    setPopupContentToShow('projects')
  }, [showCreateProjectForm])

  const handleChangePopupContentToShow = useCallback((contentToSet: PopupContentToShow) => {
    setPopupContentToShow(contentToSet)
  }, [])

  const toggleShowCreateCustomerForm = useCallback(() => {
    setShowCreateProjectForm(!showCreateProjectForm)
    setPopupContentToShow('customers')
  }, [showCreateProjectForm])

  const handleGetProjects = useCallback(async () => {
    setLoadingProjects(true)

    const { data: projectsResponse, errors } = await client.query<IGetProjectsGroupByCustomersResponse>({
      query: PROJECTS_GROUP_BY_CUSTOMERS,
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
      setProjectsByCustomers(projectsResponse.customers)
    }

    setLoadingProjects(true)
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

            {
              projectsByCustomers.length > 0
                ? projectsByCustomers.map(({
                  id,
                  name: customerName,
                  projects
                }) => (
                  <div className="projects-customer-group" key={id}>
                    <div className="projects-customer-group-header">
                      <span className="projects-customer-group-name">{customerName}</span>

                      <span className="projects-customer-group-label">
                        Projeto / Identificador / Cliente
                      </span>
                    </div>

                    <div className="project-customer-group-list">
                      {
                        projects.length > 0
                          ? projects.map(({
                            id: projectId,
                            code: projectCode,
                            name: projectName
                          }) => (
                          <ProjectItem
                              key={projectId}
                              id={projectId}
                              code={projectCode}
                              name={projectName}
                              customerName={customerName}
                              onDelete={handleDeleteProject}
                            />
                          ))
                          : (
                            <ListAlert
                              alertType="empty"
                              alertButton={{
                                buttonText: 'Cadastrar projeto',
                                onClick: toggleShowCreateProjectForm
                              }}
                            />
                            )
                      }
                    </div>
                  </div>
                ))
                : (
                  <div className="projects-customer-group">
                    <div className="projects-customer-group-header">
                      <span className="projects-customer-group-name">Ambev</span>

                      <span className="projects-customer-group-label">
                        Projeto / Identificador / Cliente
                      </span>
                    </div>

                    <div className="project-customer-group-list">
                    <ListAlert
                      alertType={loadingProjects ? 'loading' : 'empty'}
                      alertButton={loadingProjects
                        ? {
                            buttonText: 'Cadastrar cliente',
                            onClick: toggleShowCreateCustomerForm
                          }
                        : undefined}
                    />
                    </div>
                  </div>
                  )
            }
          </div>
        </MainContent>
      </div>

      {
        showCreateProjectForm && (
          <CustomPopup onClickToClose={toggleShowCreateProjectForm}>
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
  customerName,
  onDelete
}) => {
  const [customerPopupIsOpen, setCustomerPopupIsOpen] = useState(false)

  const toggleCustomerPopupIsOpen = useCallback(() => {
    setCustomerPopupIsOpen(!customerPopupIsOpen)
  }, [customerPopupIsOpen])

  return (
    <ProjectItemContainer>
      <div className="project-row">
        <Input placeholder={name} inputStyle="high" defaultValue={name} />

        <Input placeholder={code} inputStyle="high" defaultValue={code} />

        <button
          className="project-select-project-or-customer-button"
          onClick={toggleCustomerPopupIsOpen}
        >
          {customerName}
        </button>

        { customerPopupIsOpen && <SelectPopup popupType="customers" /> }
      </div>

      <button className="remove-project" onClick={async () => await onDelete(id)}>
        <FiTrash size={20} color="#C53030" />
      </button>
    </ProjectItemContainer>
  )
}
