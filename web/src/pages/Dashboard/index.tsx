import React from 'react'

import { TopBar } from '../../components/TopBar'
import { TimeTracker } from '../../components/TimeTracker'
import { MainContent, PageContainer } from './styles'

export const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <TopBar />

      <MainContent>
        <TimeTracker />

        <div id="marking-list-container">
          <div className="markings-day-group">
            <div className="markings-day-group-header">
              <span className="markings-day-group-date">26/11/2022</span>

              <strong className="markings-day-group-total">8:00</strong>
            </div>

            <div className="marking-day-group-list">
              <div>Mark 1 - Send to Multidados</div>
              <div>Mark 2</div>
              <div>Mark 3</div>
            </div>
          </div>
        </div>
      </MainContent>
    </PageContainer>
  )
}
