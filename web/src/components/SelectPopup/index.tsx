import React, { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { PulseLoader } from 'react-spinners'

import { Input } from '../Input'
import { Button } from '../Button'
import { useToast } from '../../hooks/toast'
import { CUSTOMERS } from '../../graphql/getCustomers'
import { CustomPopup, CreateProjectPopup, CreateCustomerPopup } from '../CustomPopup'
import { SelectPopupContainer } from './styles'

type PopupContentToShow = 'projects' | 'customers'

interface ISelectPopupProps {
  popupType: PopupContentToShow
  onSelect: (selectedId: string) => void
}

interface IGetCustomersResponse {
  customers: ICustomerProps[]
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

  const handleGetCustomers = useCallback(async (search?: string) => {
    setSearchLoading(true)

    const { data: customersResponse, errors } = await client.query<IGetCustomersResponse>({
      query: CUSTOMERS,
      variables: {
        data: { search }
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
      setCustomers(customersResponse.customers)
    }

    setSearchLoading(false)
  }, [client, toast])

  const handleReloadCustomers = useCallback(async () => {
    handleGetCustomers(searchText)

    toggleShowCreatePopupForm()
  }, [handleGetCustomers, searchText, toggleShowCreatePopupForm])

  useEffect(() => {
    if (popupType === 'customers') {
      handleGetCustomers(searchText)
    }
  }, [handleGetCustomers, popupType, searchText])

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
                      ? (
                        <>
                          <strong className="project-popup-customer">ambev</strong>

                          <ul className="project-popup-projects">
                            <li className="project-popup-project">uauness</li>
                          </ul>
                        </>
                        )
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
                                : customers.map(({ id, name }) => (
                                  <li
                                    key={id}
                                    className="customer-popup-name"
                                    onClick={() => onSelect(id)}
                                  >
                                    {name}
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
                : <CreateCustomerPopup afterSubmit={handleReloadCustomers} />
            }
          </CustomPopup>
        )
      }
    </SelectPopupContainer>
  )
}
