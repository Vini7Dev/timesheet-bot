import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { PulseLoader } from 'react-spinners'

import { Input } from '../Input'
import { Button } from '../Button'
import { useToast } from '../../hooks/toast'
import { CUSTOMERS } from '../../graphql/getCustomers'
import { PROJECTS } from '../../graphql/getProjects'
import { CustomPopup } from '../CustomPopup'
import { CreateCustomerPopup } from '../CustomPopup/CreateCustomerPopup'
import { SelectPopupContainer } from './styles'
import { groupProjectsByCustomer } from '../../utils/groupProjectsByCustomer'
import { CreateProjectPopup } from '../CustomPopup/CreateProjectPopup'

type PopupContentToShow = 'projects' | 'customers'

interface ISelectPopupProps {
  popupType: PopupContentToShow
  onSelect: (data: IProjectProps | ICustomerProps) => void
}

interface IGetCustomersResponse {
  customers: ICustomerProps[]
}

interface IGetProjectsResponse {
  projects: IProjectProps[]
}

export const SelectPopup: React.FC<ISelectPopupProps> = ({
  onSelect,
  popupType
}) => {
  const client = useApolloClient()
  const toast = useToast()

  const [searchText, setSearchText] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [customers, setCustomers] = useState<ICustomerProps[]>([])
  const [projects, setProjects] = useState<IProjectProps[]>([])

  const [showCreatePopupForm, setShowCreatePopupForm] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>(popupType)

  const toggleShowCreatePopupForm = useCallback(() => {
    setShowCreatePopupForm(!showCreatePopupForm)
    setPopupContentToShow(popupType)
  }, [popupType, showCreatePopupForm])

  const handleChangePopupContentToShow = useCallback((contentToSet: PopupContentToShow) => {
    setPopupContentToShow(contentToSet)
  }, [])

  const handleShowPopup = useCallback((contentToShow: PopupContentToShow) => {
    setPopupContentToShow(contentToShow)
    setShowCreatePopupForm(true)
  }, [])

  const handleGetProjects = useCallback(async (search?: string) => {
    setSearchLoading(true)

    try {
      const { data: projectsResponse } = await client.query<IGetProjectsResponse>({
        query: PROJECTS,
        variables: {
          data: { search }
        },
        fetchPolicy: 'no-cache'
      })

      setProjects(projectsResponse.projects)
    } catch (err: any) {
      toast.addToast({
        type: 'error',
        message: err.message
      })
    }

    setSearchLoading(false)
  }, [client])

  const handleGetCustomers = useCallback(async (search?: string) => {
    setSearchLoading(true)

    try {
      const { data: customersResponse } = await client.query<IGetCustomersResponse>({
        query: CUSTOMERS,
        variables: {
          data: { search }
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

    setSearchLoading(false)
  }, [client])

  const handleReloadList = useCallback(async () => {
    if (popupType === 'customers') {
      handleGetCustomers(searchText)
    } else {
      handleGetProjects(searchText)
    }

    toggleShowCreatePopupForm()
  }, [handleGetCustomers, handleGetProjects, popupType, searchText, toggleShowCreatePopupForm])

  useEffect(() => {
    if (popupType === 'customers') {
      handleGetCustomers(searchText)
    } else {
      handleGetProjects(searchText)
    }
  }, [handleGetCustomers, handleGetProjects, popupType, searchText])

  return (
    <SelectPopupContainer id="popup-container">
      <Input
        placeholder="Pesquise..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div id="popup-results">
        {
          (
            (popupContentToShow === 'customers' && customers.length === 0) ||
            (popupContentToShow === 'projects' && projects.length === 0)
          )
            ? (
              <div id="popup-empty-container">
                <p id="popup-empty-text">
                  Sem resultados...
                </p>
              </div>
              )
            : (
                <div className="popup-item">
                  {
                    popupContentToShow === 'projects'
                      ? groupProjectsByCustomer(projects).map(({
                        customer,
                        projects: customerProjects
                      }) => (
                        <>
                          <strong className="project-popup-customer">{customer.name}</strong>

                          <ul
                            key={customer.id}
                            className="project-popup-projects"
                          >
                            {
                              searchLoading
                                ? (
                                  <li className="project-popup-project">
                                    <PulseLoader color="#FFF" size={8} />
                                  </li>
                                  )
                                : customerProjects.map((project) => (
                                  <li
                                    key={project.id}
                                    className="project-popup-project"
                                    onClick={() => onSelect(project)}
                                  >
                                    {project.name}
                                  </li>
                                ))
                            }
                          </ul>
                        </>
                      ))
                      : (
                        <>
                          <ul className="customers-popup-list">
                            {
                              searchLoading
                                ? (
                                  <li className="customer-popup-name">
                                    <PulseLoader color="#FFF" size={8} />
                                  </li>
                                  )
                                : customers.map((customer) => (
                                  <li
                                    key={customer.id}
                                    className="customer-popup-name"
                                    onClick={() => onSelect(customer)}
                                  >
                                    {customer.name}
                                  </li>
                                ))
                            }
                          </ul>
                        </>
                        )
                  }
                </div>
              )
        }
      </div>

      <Button
        onClick={() => handleShowPopup(popupContentToShow)}
        text={popupContentToShow === 'projects' ? 'Cadastrar projeto' : 'Cadastrar cliente'}
      />

      {
        showCreatePopupForm && (
          <CustomPopup onClickToClose={toggleShowCreatePopupForm}>
            {
              popupContentToShow === 'projects'
                ? (
                  <CreateProjectPopup
                    afterSubmit={toggleShowCreatePopupForm}
                    onSelectCreateCustomer={() => handleChangePopupContentToShow('customers')}
                  />
                  )
                : <CreateCustomerPopup afterSubmit={handleReloadList} />
            }
          </CustomPopup>
        )
      }
    </SelectPopupContainer>
  )
}
