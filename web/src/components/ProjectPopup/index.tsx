import React from 'react'

import { Input } from '../Input'
import { Button } from '../Button'
import { ProjectPopupContainer } from './styles'

export const ProjectPopup: React.FC = () => {
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

      <Button text="Cadastrar projeto" />
    </ProjectPopupContainer>
  )
}
