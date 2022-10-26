import { Builder, By, until, WebDriver } from 'selenium-webdriver'
import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import chromedriver from 'chromedriver'

import { groupMarkingsByMonth } from '@utils/groupMarkingsByMonth'
import { delay } from '@utils/delay'
import { crawlerConfig } from '@configs/crawler'
import { ICrawler } from '../models/ICrawler'
import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'
import { ICrawlerResponseDTO, IMarkingResponse } from '../dtos/ICrawlerResponseDTO'
import { ITimesheetAuthDTO } from '../dtos/ITimesheetAuthDTO'

interface IOpenMarkingData {
  date: string
  start_time: string
  finish_time: string
}

interface ICheckIfTheModalMarkingIsEqualToReceivedMarking {
  custumer_code: string,
  project_code: string,
  work_class: 'PRODUCTION' | 'ABSENCE',
  description: string,
  start_time: string,
  finish_time: string,
  start_interval_time?: string | null,
  finish_interval_time?: string | null,
}

interface IWaitByElement {
  value: string
  by: 'id' | 'className' | 'css' | 'linkText' | 'js' | 'name' | 'partialLinkText' | 'xpath'
}

const {
  browserWindowRect,
  urls,
} = crawlerConfig

export class SeleniumProvider implements ICrawler {
  private driverStatus: 'OFF' | 'ON' = 'OFF'

  private driver: WebDriver

  private async checkDriverStatus(): Promise<void> {
    if (this.driverStatus === 'OFF') {
      await this.init()
    }
  }

  private async init(): Promise<void> {
    chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())

    this.driver = await new Builder()
      .forBrowser('chrome')
      .withCapabilities(webdriver.Capabilities.chrome())
      .build()

    this.driver.manage().window().setRect(browserWindowRect)

    this.driverStatus = 'ON'
  }

  private async waitByElements(elementFilters: IWaitByElement[]): Promise<void> {
    const promises: Promise<any>[] = []

    elementFilters.forEach((elementFilter) => {
      promises.push(
        this.driver.wait(
          until.elementLocated(By[elementFilter.by](elementFilter.value)),
          30000,
        )
      )
    })

    await Promise.all(promises)
  }

  private async getAlertErrors(): Promise<string[]> {
    const alert = await this.driver.switchTo().alert()
    const alertText = await alert.getText()

    const errorsMessages = alertText.replace(/\n/gi, '').split('-  ')
    errorsMessages.shift()

    await alert.accept()

    return errorsMessages
  }

  public async stopCrawler(): Promise<void> {
    await this.driver.close()

    this.driverStatus = 'OFF'
  }

  public async authenticateTimesheet({
    username,
    password,
  }: ITimesheetAuthDTO): Promise<void> {
    await this.checkDriverStatus()

    // Open login page
    await this.driver.get(urls.login())

    await this.waitByElements([
      { by: 'id', value: 'login' },
      { by: 'id', value: 'password_sem_md5' },
      { by: 'id', value: 'submit' },
    ])

    // Fill login form and submit
    await this.driver.findElement(By.id('login')).sendKeys(username)
    await this.driver.findElement(By.id('password_sem_md5')).sendKeys(password)
    await this.driver.findElement(By.id('submit')).click()

    // Wait loading of authenticated page
    await this.waitByElements([{ by: 'css', value: '[title="Timesheet"]' }])
  }

  public async saveTimesheetTasks({
    markings,
  }: ISaveMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    const markingsResponse: IMarkingResponse[] = []
    for(const marking of markings) {
      try {
        // Open add marking page on marking date (to get marking id on timesheet)
        const markingGroupFullDate = marking.date.split('/').reverse().join('-')
        await this.driver.get(urls.addMarking({ DATA: markingGroupFullDate, SHOW: 'list' }))

        await this.waitByElements([{ by: 'css', value: 'td > table.list-table' }])

        // Open modal to add marking
        await this.driver.executeScript(`editHora()`)

        await this.waitByElements([
          { by: 'id', value: 'codcliente_form_lanctos' },
          { by: 'id', value: 'codprojeto_form_lanctos' },
          { by: 'id', value: 'f_data_b' }
        ])

        // Select customer and project
        await this.driver.findElement(By.id('codcliente_form_lanctos'))
          .sendKeys(marking.custumer_code.padStart(10, '0'))
        await this.driver.findElement(By.id('codprojeto_form_lanctos'))
          .sendKeys(marking.project_code)

        // Set marking date
        await this.driver.findElement(By.id('f_data_b')).clear()
        await this.driver.findElement(By.id('f_data_b')).sendKeys(marking.date)

        await this.waitByElements([
          { by: 'css', value: '#idutbms_classe > option:nth-child(1)' },
        ])

        // Set marking work class
        if (marking.work_class === 'ABSENCE') {
          await this.driver.findElement(By.css('#idutbms_classe > option:nth-child(1)')).click()
        }

        await this.waitByElements([
          { by: 'id', value: 'narrativa_principal' },
          { by: 'id', value: 'hora' },
          { by: 'id', value: 'hora_fim' },
          { by: 'id', value: 'intervalo_hr_inicial' },
          { by: 'id', value: 'intervalo_hr_final' },
        ])

        // Set times and description
        await this.driver.findElement(By.id('hora')).sendKeys(marking.start_time)
        if (marking.start_interval_time && marking.finish_interval_time) {
          await this.driver.findElement(By.id('intervalo_hr_inicial')).sendKeys(marking.start_interval_time)
          await this.driver.findElement(By.id('intervalo_hr_final')).sendKeys(marking.finish_interval_time)
        }
        await this.driver.findElement(By.id('hora_fim')).sendKeys(marking.finish_time)
        await this.driver.findElement(By.id('narrativa_principal')).sendKeys(marking.description)

        await this.waitByElements([{
          by: 'css',
          value: '[style="cursor: pointer; background: none;"]',
        }])

        // Submit form
        await this.driver.findElement(
          By.css('.ui-dialog-buttonset button:nth-child(1)')
        ).click()

        await delay(3000)

        try {
          // The method "getAlertErrors" throw an error if alert does not exists
          markingsResponse.push({
            id: marking.id,
            on_timesheet_status: 'NOT_SENT',
            timesheet_error: await this.getAlertErrors()
          })

          // Reload window
          await this.driver.get(urls.addMarking({
            SHOW: 'list',
          }))
        } catch {
          // Marking susseffull saved, getting timesheet id
          await this.waitByElements([{ by:'css', value: 'td > table.list-table > tbody' }])

          const tableMarkingsElements = await this.driver.findElements(
            By.css('td > table.list-table > tbody > tr > td')
          )

          // Getting marking timesheet id
          for (const tableMarkingElement of tableMarkingsElements) {
            const markingElementText = await tableMarkingElement.getText()
            const elementStartAndFinishTime = markingElementText.replace(/\n/gi, '')
              .split('Total Horas')[0]
              .split('Horário : ')[1]

            const markingStartFinishTime = `${marking.start_time} - ${marking.finish_time}`
            if (elementStartAndFinishTime === markingStartFinishTime) {
              const timesheetMarking = await tableMarkingElement.getAttribute('id')

              markingsResponse.push({
                id: marking.id,
                on_timesheet_id: timesheetMarking,
                on_timesheet_status: 'SENT',
              })

              break
            }
          }
        }
      } catch(err: any) {
        // An error occurred before save marking
        markingsResponse.push({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: [err.message]
        })

        // Reload window
        await this.driver.get(urls.addMarking({
          SHOW: 'list',
        }))
      }
    }

    return { markingsResponse }
  }

  public async updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    throw new Error('Method not implemented.')
  }

  public async deleteTimesheetTasks({
    markings,
  }: IDeleteMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()
    
    // Open markings list page
    await this.driver.get(urls.addMarking({ SHOW: 'list' }))
    
    const markingsResponse: IMarkingResponse[] = []
    for (const marking of markings) {
      try {
        // Wait page loading
        await this.waitByElements([{ by: 'css', value: 'td > table.list-table' }])

        // Open marking data modal
        await this.driver.executeScript(`editHora('', '', '', '${marking.on_timesheet_id}', 'T')`)

        // Click on delete button
        await this.waitByElements([{ by: 'css', value: 'button:nth-child(1)' }])
      
        await this.driver.findElement(By.css('button:nth-child(1)')).click()
        
        await this.driver.switchTo().alert().accept()

        await delay(3000)
        
        markingsResponse.push({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
        })
      } catch(err: any) {
        // An error occurred before save marking
        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
          on_timesheet_status: 'SENT',
          timesheet_error: [err.message]
        })

        // Reload window
        await this.driver.get(urls.addMarking({ SHOW: 'list' }))
      }
    }

    return { markingsResponse }
  }
}
