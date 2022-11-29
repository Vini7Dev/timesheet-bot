import React, { useCallback, useState } from 'react'
import { FiDollarSign, FiClock } from 'react-icons/fi'

import { Input } from '../../components/Input'
import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { MainContent, MarkingItemContainer, PageContainer } from './styles'
import { ProjectPopup } from '../../components/ProjectPopup'

export const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <TopBar />

      <MainContent>
        <TimeTracker />

        <div id="marking-list-container">
          <strong id="margking-list-title">Marcações</strong>

          <div className="markings-day-group">
            <div className="markings-day-group-header">
              <span className="markings-day-group-date">26/11/2022</span>

              <strong className="markings-day-group-total">8:00</strong>
            </div>

            <div className="marking-day-group-list">
              <MarkingItem />
              <MarkingItem />
              <MarkingItem />
              <MarkingItem />
            </div>
          </div>
        </div>
      </MainContent>
    </PageContainer>
  )
}

const MarkingItem: React.FC = () => {
  const [isBillable, setIsBillable] = useState(false)
  const [projectPopupIsOpen, setProjectPopupIsOpen] = useState(false)

  const toggleIsBillable = useCallback(() => {
    setIsBillable(!isBillable)
  }, [isBillable])

  const toggleProjectPopupIsOpen = useCallback(() => {
    setProjectPopupIsOpen(!projectPopupIsOpen)
  }, [projectPopupIsOpen])

  return (
    <MarkingItemContainer>
      <div className="marking-row marking-row-first">
        <Input placeholder="Descrição..." inputStyle="timer" />

        <button
          className="marking-project-button"
          onClick={toggleProjectPopupIsOpen}
        >
          + Projeto
        </button>

        { projectPopupIsOpen && <ProjectPopup /> }
      </div>

      <div className="marking-row marking-row-second">
        <button
          className="marking-billable-button"
          onClick={toggleIsBillable}
        >
          <FiDollarSign
            color={isBillable ? '#03A9F4' : '#C6D2D9'}
            size={22}
          />
        </button>

        <div className="marking-times-container marking-times-start-end">
          <span className="marking-times-text">Tempo gasto</span>

          <div className="margking-time-inputs">
            <Input placeholder="10:00" inputStyle="timer" />
            :
            <Input placeholder="11:00" inputStyle="timer" />
          </div>
        </div>

        <div className="marking-times-container marking-times-pause">
          <div className="marking-times-text">Tempo de pausa</div>

          <div className="margking-time-inputs">
            <Input placeholder="10:00" inputStyle="timer" />
            :
            <Input placeholder="11:00" inputStyle="timer" />
          </div>
        </div>

        <span className="marking-time-total">
          <FiClock color="#C6D2D9" size={14} /> 3:00
        </span>
      </div>
    </MarkingItemContainer>
  )
}
