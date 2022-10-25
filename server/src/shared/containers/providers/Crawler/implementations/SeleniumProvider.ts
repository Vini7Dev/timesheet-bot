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

        await this.driver.get(urls.addMarking({
          DATA: markingGroupFullDate,
          SHOW: 'list',
        }))

        // Wait page load
        await this.waitByElements([{
          by: 'css',
          value: 'td > table.list-table',
        }])

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
        await this.driver.findElement(By.css('.ui-dialog-buttonset button:nth-child(1)')).click()

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

    // Grouping markings by year and month
    const markingsGroupByDate = groupMarkingsByMonth(markings)

    const markingsResponse: IMarkingResponse[] = []
    for (const markingsByYear of markingsGroupByDate) {  
      for(const markingsByMonth of markingsByYear.months) {
        // Building marking group date to insert into url query parameters
        const markingGroupFullDate = `${markingsByYear.year}-${markingsByMonth.month}-01`
        
        for (const marking of markingsByMonth.markings) {
          try {
            // Open add markings page on task's month
            await this.driver.get(urls.addMarking({ DATA: markingGroupFullDate }))

            // Opening marking modal
            const openModal = await this.openMarkingDataModalByDateAndTime({
              date: marking.date,
              start_time: marking.start_time,
              finish_time: marking.finish_time,
            })

            if (!openModal) {
              markingsResponse.push({
                id: marking.id,
                on_timesheet_status: 'SENT',
                timesheet_error: ['A marcação não foi encontrada'],
              })

              continue
            }

            // Check if the modal marking is equal to received marking data
            await this.checkIfTheModalMarkingIsEqualToReceivedMarking({
              description: marking.description,
              start_time: marking.start_time,
              finish_time: marking.finish_time,
              start_interval_time: marking.start_interval_time,
              finish_interval_time: marking.finish_interval_time,
              work_class: marking.work_class,
              custumer_code: marking.custumer_code,
              project_code: marking.project_code,
            })

            await this.waitByElements([{
              by: 'css',
              value: 'div.ui-dialog-buttonpane > div > button:nth-child(1)'
            }])

            await this.driver.findElement(
              By.css('div.ui-dialog-buttonpane > div > button:nth-child(1)')
            ).click()

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
              on_timesheet_status: 'SENT',
              timesheet_error: [err.message]
            })

            // Reload window
            await this.driver.get(urls.addMarking({ DATA: markingGroupFullDate }))
          }
        }
      }
    }

    return { markingsResponse }
  }

  private async openMarkingDataModalByDateAndTime({
    date,
    start_time,
    finish_time,
  }: IOpenMarkingData): Promise<boolean> {
    const [markingDay] = date.split('/')

    await this.waitByElements([{
      by: 'css',
      value: `[href="javascript:editHora('08:00','','${date}')"]`,
    }])

    // Get calendar rows
    const calendarTableRows = await this.driver.findElements(
      By.css('td > table.list-table > tbody > tr')
    )
    for (let i = 0; i < calendarTableRows.length; i++) {      
      if (i === 0) continue // Ignore week days row
      if (parseInt(markingDay) > 7 && i < 3) continue // Make sure to get the correct day of the month

      // Getting row data elements
      const calendarTableRow = calendarTableRows[i]
      const rowTableDatas = await calendarTableRow.findElements(By.css('.list-td'))

      for (const rowTableData of rowTableDatas) {
        const tableDataLinks = await rowTableData.findElements(By.css('a'))
        const dayLinkText = await tableDataLinks[0].getText()
        const dayLinkWithoutMonthText = dayLinkText.split(' ')[0]

        if (dayLinkWithoutMonthText === markingDay) {
          // Looking for the marking by time and open modal
          for(const tableDataLink of tableDataLinks) {
            const linkText = await tableDataLink.getText()

            if(linkText === `${start_time} - ${finish_time}`) {
              await tableDataLink.click()
              return true
            }
          }
        }
      }
    }

    return false
  }

  private async checkIfTheModalMarkingIsEqualToReceivedMarking(
    marking: ICheckIfTheModalMarkingIsEqualToReceivedMarking
  ) {
    await this.waitByElements([
      { by: 'css', value: 'table:nth-child(10) > tbody > tr:nth-child(2) > td.colunaDado' },
      { by: 'css', value: 'table:nth-child(10) > tbody > tr:nth-child(3) > td.colunaDado' },
      { by: 'id', value: 'idutbms_classe' },
      { by: 'id', value: 'narrativa_principal' },
      { by: 'id', value: 'hora' },
      { by: 'id', value: 'hora_fim' },
      { by: 'id', value: 'intervalo_hr_inicial' },
      { by: 'id', value: 'intervalo_hr_final' },
    ])

    const markingCustomerCode = await this.driver.findElement(
      By.css('table:nth-child(10) > tbody > tr:nth-child(2) > td.colunaDado')
    ).getText()
      
    if (marking.custumer_code.padStart(10, '0') !== markingCustomerCode.split(' - ')[0])
      throw new Error('Different customer_code received!')
      
    const markingProjectCode = await this.driver.findElement(
      By.css('table:nth-child(10) > tbody > tr:nth-child(3) > td.colunaDado')
    ).getText()

    if (marking.project_code !== markingProjectCode.split(' - ')[0])
      throw new Error('Different project_code received!')

    const markingWorkClass = await this.driver
      .findElement(By.id('idutbms_classe')).getAttribute('value')

    const workClassReceived = marking.work_class === 'PRODUCTION' ? '63' : '57'
    if (marking.work_class === 'PRODUCTION' && workClassReceived !== markingWorkClass)
      throw new Error('Different work_class received!')

    const markingDescription = await this.driver
      .findElement(By.id('narrativa_principal')).getAttribute('value')

    if (marking.description !== markingDescription)
      throw new Error('Different description received!')

    const markingStartTime = await this.driver
      .findElement(By.id('hora')).getAttribute('value')

    if (marking.start_time !== markingStartTime)
      throw new Error('Different start_time received!')

    const markingFinishTime = await this.driver
      .findElement(By.id('hora_fim')).getAttribute('value')

    if (marking.finish_time !== markingFinishTime)
      throw new Error('Different finish_time received!')

    const markingStartIntervalTime = await this.driver
      .findElement(By.id('intervalo_hr_inicial')).getAttribute('value')

    if (marking.start_interval_time && marking.start_interval_time !== markingStartIntervalTime)
      throw new Error('Different start_interval_time received!')

    const markingFinishIntervalTime = await this.driver
      .findElement(By.id('intervalo_hr_final')).getAttribute('value')

    if (marking.finish_interval_time && marking.finish_interval_time !== markingFinishIntervalTime)
      throw new Error('Different finish_interval_time received!')
  }
}
