import React, { useCallback, useState } from 'react'

import { Input } from '../Input'
import { Button } from '../Button'
import { CreateProjectOrCustomerForm, ProjectPopupContainer } from './styles'
import { CustomPopup } from '../CustomPopup'
import { Select } from '../Select'

type PopupContentToShow = 'CREATE_PROJECT' | 'CREATE_CUSTOMER'

interface ICreateProjectPopupProps {
  onSubmit: () => void
  onSelectCreateCustomer: () => void
}

interface ICreateCustomerPopupProps {
  onSubmit: () => void
}

export const ProjectPopup: React.FC = () => {
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false)
  const [popupContentToShow, setPopupContentToShow] = useState<PopupContentToShow>('CREATE_PROJECT')

  const toggleShowCreateProjectPopup = useCallback(() => {
    setShowCreateProjectPopup(!showCreateProjectPopup)
  }, [showCreateProjectPopup])

  const handleChangePopupContentToShow = useCallback((contentToSet: PopupContentToShow) => {
    setPopupContentToShow(contentToSet)
  }, [])

  const handleShowPopup = useCallback((contentToShow: PopupContentToShow) => {
    setPopupContentToShow(contentToShow)
    setShowCreateProjectPopup(true)
  }, [])

  const handleClosePopup = useCallback(() => {
    setPopupContentToShow('CREATE_PROJECT')
    setShowCreateProjectPopup(false)
  }, [])

  return (
    <ProjectPopupContainer id="timer-project-popup-container">
      <Input placeholder="Pesquise..." />

      <div id="timer-project-popup-results">
        <div id="timer-project-popup-empty-container">
          <p id="timer-project-popup-empty-text">
            Sem resultados...
          </p>
        </div>

        <div className="timer-project-popup-item">
          <strong className="timer-project-popup-customer">ambev</strong>

          <ul className="timer-project-popup-projects">
            <li className="timer-project-popup-project">uauness</li>
          </ul>
        </div>
      </div>

      <Button text="Cadastrar projeto" onClick={() => handleShowPopup('CREATE_PROJECT')} />

      {
        showCreateProjectPopup && (
          <CustomPopup>
            {
              popupContentToShow === 'CREATE_PROJECT'
                ? (
                  <CreateProjectPopup
                    onSubmit={toggleShowCreateProjectPopup}
                    onSelectCreateCustomer={() => handleChangePopupContentToShow('CREATE_CUSTOMER')}
                  />
                  )
                : <CreateCustomerPopup onSubmit={toggleShowCreateProjectPopup} />
            }
          </CustomPopup>
        )
      }
    </ProjectPopupContainer>
  )
}

const CreateProjectPopup: React.FC<ICreateProjectPopupProps> = ({
  onSubmit,
  onSelectCreateCustomer
}) => {
  return (
    <CreateProjectOrCustomerForm>
      <h1 id="create-project-title">Cadastrar projeto</h1>

      <div className="input-margin-bottom">
        <Select
          options={[
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' },
            { value: 'ambev123', label: 'AMBEV' }
          ]}
        />

        <span id="create-customer-link" onClick={onSelectCreateCustomer}>
          Cadastrar um novo cliente
        </span>
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Código do projeto no multidados" />
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Nome do projeto" />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={onSubmit} />
      </div>
    </CreateProjectOrCustomerForm>
  )
}

const CreateCustomerPopup: React.FC<ICreateCustomerPopupProps> = ({
  onSubmit
}) => {
  return (
    <CreateProjectOrCustomerForm>
      <h1 id="create-project-title">Cadastrar cliente</h1>

      <div className="input-margin-bottom">
        <Input placeholder="Código do projeto no multidados" />
      </div>

      <div className="input-margin-bottom">
        <Input placeholder="Nome do projeto" />
      </div>

      <div className="button-margin-top">
        <Button text="Cadastrar" onClick={onSubmit} />
      </div>
    </CreateProjectOrCustomerForm>
  )
}
