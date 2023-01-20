import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { FiTrash } from 'react-icons/fi'
import * as Yup from 'yup'

import { PROJECTS_GROUP_BY_CUSTOMERS } from '../../graphql/queries/getProjectsGroupByCustomers'
import { UPDATE_PROJECT } from '../../graphql/mutations/updateProject'
import { DELETE_PROJECT } from '../../graphql/mutations/deleteProject'
import { yupFormValidator } from '../../utils/yupFormValidator'
import { useToast } from '../../hooks/toast'
import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { SelectPopup } from '../../components/SelectPopup'
import { Navigation } from '../../components/Navigation'
import { Button } from '../../components/Button'
import { TimeTracker } from '../../components/TimeTracker'
import { ListAlert } from '../../components/ListAlert'
import { CustomPopup } from '../../components/CustomPopup'
import { CreateProjectPopup } from '../../components/CustomPopup/CreateProjectPopup'
import { CreateCustomerPopup } from '../../components/CustomPopup/CreateCustomerPopup'
import { MainContent, ProjectItemContainer, PageContainer } from './styles'
import { Pagination } from '../../components/Pagination'

type PopupContentToShow = 'projects' | 'customers'

interface IProectsByCustomerProps {
  id: string
  name: string
  projects: IProjectProps[]
}

interface IGetProjectsGroupByCustomersResponse {
  customers: IProectsByCustomerProps[]
}

interface IUpdateProjectProps {
  project_id: string
  code?: string
  name?: string
  customer_id?: string
}

interface IProjectItemProps extends IProjectProps {
  customer_id: string
  customer_name: string
  onDelete: (id: string) => Promise<void>
  onUpdate: (data: IUpdateProjectProps) => Promise<void>
}

export const Projects: React.FC = () => {
  const client = useApolloClient()
  const toast = useToast()

  const [projectsByCustomers, setProjectsByCustomers] = useState<IProectsByCustomerProps[]>([])
  const [projectsPage, setProjectsPage] = useState(1)
  const [projectsPerPage, setProjectsPerPage] = useState(10)
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>('projects')

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

    try {
      const pageSkip = (projectsPage - 1) * projectsPerPage
      const pageTake = pageSkip + projectsPerPage

      const { data: projectsResponse } = await client.query<IGetProjectsGroupByCustomersResponse>({
        query: PROJECTS_GROUP_BY_CUSTOMERS,
        variables: {
          data: {
            page: pageSkip,
            perPage: pageTake
          }
        },
        fetchPolicy: 'no-cache'
      })

      setProjectsByCustomers(projectsResponse.customers)
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setLoadingProjects(false)
  }, [client, projectsPage, projectsPerPage])

  const handleDeleteProject = useCallback(async (id: string) => {
    try {
      const response = confirm('Deseja apagar o projeto? Essa ação não pode ser desfeita!')

      if (!response) {
        return
      }

      await client.mutate<{ deleteProject: string }>({
        mutation: DELETE_PROJECT, variables: { deleteProjectId: id }
      })

      toast.addToast({
        type: 'success',
        message: 'Projeto removido com sucesso!'
      })

      await handleGetProjects()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, handleGetProjects])

  const handleReloadProjects = useCallback(async () => {
    handleGetProjects()

    toggleShowCreateProjectForm()
  }, [handleGetProjects, toggleShowCreateProjectForm])

  const handleUpdateProject = useCallback(async ({
    project_id,
    customer_id,
    code,
    name
  }: IUpdateProjectProps) => {
    const schema = Yup.object().shape({
      project_id: Yup.string().uuid('UUID invalido do projeto').required('Não foi possível recuperar o ID do projeto!'),
      customer_id: Yup.string().uuid('UUID invalido do cliente'),
      code: Yup.string().min(1, 'O código não pode estar vazio!'),
      name: Yup.string().min(1, 'O nome não pode estar vazio!')
    })

    const projectData = {
      project_id,
      code,
      name,
      customer_id
    }

    const isValid = await yupFormValidator({
      schema,
      data: projectData,
      addToast: toast.addToast
    })

    if (!isValid) {
      return
    }

    try {
      await client.mutate({
        mutation: UPDATE_PROJECT,
        variables: {
          data: projectData
        }
      })

      toast.addToast({
        type: 'success',
        message: 'Projeto atualizado com sucesso!'
      })

      handleGetProjects()
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }
  }, [client, handleGetProjects, toast.addToast])

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
              loadingProjects
                ? (<div className="projects-customer-group">
                    <div className="project-customer-group-list">
                      <ListAlert alertType={'loading'} />
                    </div>
                  </div>)
                : projectsByCustomers.length > 0
                  ? projectsByCustomers.map(({
                    id: customer_id,
                    name: customer_name,
                    projects
                  }) => (
                    <div className="projects-customer-group" key={customer_id}>
                      <div className="projects-customer-group-header">
                        <span className="projects-customer-group-name">
                          <span>Cliente:</span> {customer_name}
                        </span>

                        <span className="projects-customer-group-label">
                          Projeto / Identificador / Cliente
                        </span>
                      </div>

                      <div className="project-customer-group-list">
                        {
                          projects.length > 0
                            ? projects.map(({
                              id: project_id,
                              code: projectCode,
                              name: projectName
                            }) => (
                            <ProjectItem
                                key={project_id}
                                id={project_id}
                                code={projectCode}
                                name={projectName}
                                customer_id={customer_id}
                                customer_name={customer_name}
                                onDelete={handleDeleteProject}
                                onUpdate={handleUpdateProject} customer={{
                                  id: '',
                                  name: ''
                                }} />
                            ))
                            : (<ListAlert
                                alertType="empty"
                                alertButton={{
                                  buttonText: 'Cadastrar projeto',
                                  onClick: toggleShowCreateProjectForm
                                }}
                              />)
                        }
                      </div>
                    </div>
                  ))
                  : (<div className="projects-customer-group">
                      <div className="project-customer-group-list">
                        <ListAlert
                          alertType={'empty'}
                          alertButton={{
                            buttonText: 'Cadastrar cliente',
                            onClick: toggleShowCreateCustomerForm
                          }}
                        />
                      </div>
                    </div>)
            }
          </div>

          <Pagination
            currentPage={projectsPage}
            perPageOptions={[10, 25, 50]}
            onChangeInputPage={(newPage) => setProjectsPage(newPage)}
            onNextPage={(nextPage) => setProjectsPage(nextPage)}
            onPreviousPage={(previousPage) => setProjectsPage(previousPage)}
            onSelectPerPage={(perPageSelected) => setProjectsPerPage(perPageSelected)}
          />
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
  customer_id,
  customer_name,
  onDelete,
  onUpdate
}) => {
  const [customerPopupIsOpen, setCustomerPopupIsOpen] = useState(false)

  const toggleCustomerPopupIsOpen = useCallback(() => {
    setCustomerPopupIsOpen(!customerPopupIsOpen)
  }, [customerPopupIsOpen])

  const updateProject = useCallback(({
    newName, newCode, newCustomerId
  }: {
    newName?: string
    newCode?: string
    newCustomerId?: string
  }) => {
    if (code === newCode || name === newName || newCustomerId === customer_id) {
      return
    }

    onUpdate({
      project_id: id,
      code: newCode,
      name: newName,
      customer_id: newCustomerId
    })
  }, [code, customer_id, id, name, onUpdate])

  return (
    <ProjectItemContainer>
      <div className="project-row">
        <Input
          placeholder={name}
          inputStyle="high"
          defaultValue={name}
          onBlur={(e) => updateProject({ newName: e.target.value })}
        />

        <Input
          placeholder={code}
          inputStyle="high"
          defaultValue={code}
          onBlur={(e) => updateProject({ newCode: e.target.value })}
        />

        <button
          className="project-select-project-or-customer-button"
          onClick={toggleCustomerPopupIsOpen}
        >
          {customer_name}
        </button>

        { customerPopupIsOpen && (
          <SelectPopup
            popupType="customers"
            onSelect={(customer: ICustomerProps) => {
              updateProject({ newCustomerId: customer.id })
              toggleCustomerPopupIsOpen()
            }}
          />
        ) }
      </div>

      <button className="remove-project" onClick={async () => await onDelete(id)}>
        <FiTrash size={20} color="#C53030" />
      </button>
    </ProjectItemContainer>
  )
}
