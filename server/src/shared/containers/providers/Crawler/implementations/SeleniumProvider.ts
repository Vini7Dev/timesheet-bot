import { Builder, By, until, WebDriver } from 'selenium-webdriver'
import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import chromedriver from 'chromedriver'

import { delay } from '@utils/delay'
import { crawlerConfig } from '@configs/crawler'
import { ICrawler } from '../models/ICrawler'
import { IDeleteMarkingsDTO } from '../dtos/IDeleteMarkingsDTO'
import { ISaveMarkingsDTO } from '../dtos/ISaveMarkingsDTO'
import { IUpdateMarkingsDTO } from '../dtos/IUpdateMarkingsDTO'
import { ICrawlerResponseDTO, IMarkingResponse } from '../dtos/ICrawlerResponseDTO'
import { ITimesheetAuthDTO } from '../dtos/ITimesheetAuthDTO'

type BySelectors = 'id'
  | 'className'
  | 'css'
  | 'linkText'
  | 'js'
  | 'name'
  | 'partialLinkText'
  | 'xpath'

interface IWaitByElement {
  by: BySelectors
  selector: string
}

interface IFillFormInputElements {
  by: BySelectors
  selector: string
  value: string
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
          until.elementLocated(By[elementFilter.by](elementFilter.selector)),
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
    try {
      await this.driver.close()
    } catch (err) {
      console.error(err)
    } finally {
      this.driverStatus = 'OFF'
    }
  }

  private async fillFormInputElements(
    inputs: IFillFormInputElements[]
  ): Promise<void> {
    for (const input of inputs) {
      const inputElement = await this.driver.findElement(By[input.by](input.selector))
      await inputElement.clear()
      await inputElement.sendKeys(input.value)
    }
  }

  public async authenticateTimesheet({
    username,
    password,
  }: ITimesheetAuthDTO): Promise<void> {
    await this.checkDriverStatus()

    // Open login page
    await this.driver.get(urls.login())

    await this.waitByElements([
      { by: 'id', selector: 'login' },
      { by: 'id', selector: 'password_sem_md5' },
      { by: 'id', selector: 'submit' },
    ])

    // Fill login form and submit
    await this.driver.findElement(By.id('login')).sendKeys(username)
    await this.driver.findElement(By.id('password_sem_md5')).sendKeys(password)
    await this.driver.findElement(By.id('submit')).click()

    // Wait loading of authenticated page
    await this.waitByElements([{ by: 'css', selector: '[title="Timesheet"]' }])
  }

  public async saveTimesheetTasks({
    markings,
  }: ISaveMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    const markingsResponse: IMarkingResponse[] = []
    for(const marking of markings) {
      try {
        // Open add marking page on marking date (to get marking id on timesheet)
        await this.driver.get(urls.addMarking({ DATA: marking.date, SHOW: 'list' }))

        await this.waitByElements([{ by: 'css', selector: 'td > table.list-table' }])

        // Open modal to add marking
        await this.driver.executeScript(`editHora()`)

        await this.waitByElements([
          { by: 'id', selector: 'codcliente_form_lanctos' },
          { by: 'id', selector: 'codprojeto_form_lanctos' },
          { by: 'id', selector: 'f_data_b' }
        ])

        // Select customer and project
        await this.driver.findElement(By.id('codcliente_form_lanctos'))
          .sendKeys(marking.custumer_code.padStart(10, '0'))
        await this.driver.findElement(By.id('codprojeto_form_lanctos'))
          .sendKeys(marking.project_code)

        // Set marking date
        await this.fillFormInputElements([
          {
            by: 'id',
            selector: 'f_data_b',
            value: marking.date.split('-').reverse().join('/')
          },
        ])

        // Set marking work class
        if (marking.work_class === 'PRODUCTION') {
          await this.waitByElements([{ by: 'css', selector: '#idutbms_classe > option[value="63"]' } ])
          await this.driver.findElement(By.css('#idutbms_classe > option[value="63"]')).click()
        } else {
          await this.waitByElements([{ by: 'css', selector: '#idutbms_classe > option[value="57"]' } ])
          await this.driver.findElement(By.css('#idutbms_classe > option[value="57"]')).click()
        }

        await this.waitByElements([
          { by: 'id', selector: 'narrativa_principal' },
          { by: 'id', selector: 'hora' },
          { by: 'id', selector: 'hora_fim' },
          { by: 'id', selector: 'intervalo_hr_inicial' },
          { by: 'id', selector: 'intervalo_hr_final' },
        ])

        // Set times and description
        await this.fillFormInputElements([
          { by: 'id', selector: 'hora', value: marking.start_time },
          { by: 'id', selector: 'intervalo_hr_inicial', value: marking.start_interval_time ?? '00:00' },
          { by: 'id', selector: 'intervalo_hr_final', value: marking.finish_interval_time ?? '00:00' },
          { by: 'id', selector: 'hora_fim', value: marking.finish_time },
          { by: 'id', selector: 'narrativa_principal', value: marking.description },
        ])

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
          await this.driver.get(urls.addMarking({ SHOW: 'list' }))
        } catch {
          // Marking susseffull saved, getting timesheet id
          await this.waitByElements([{ by:'css', selector: 'td > table.list-table > tbody' }])

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
        await this.driver.get(urls.addMarking({ SHOW: 'list' }))
      }
    }

    return { markingsResponse }
  }

  public async updateTimesheetTasks({
    markings,
  }: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    // Open markings list page
    await this.driver.get(urls.addMarking({ SHOW: 'list' }))

    const markingsResponse: IMarkingResponse[] = []
    for (const marking of markings) {
      try {
        // Wait page loading
        await this.waitByElements([{ by: 'css', selector: 'td > table.list-table' }])

        // Open marking data modal
        await this.driver.executeScript(`editHora('', '', '', '${marking.on_timesheet_id}', 'T')`)

        await this.waitByElements([{ by: 'id', selector: 'f_data_b' }])

        // Set marking date
        await this.fillFormInputElements([
          {
            by: 'id',
            selector: 'f_data_b',
            value: marking.date.split('/').reverse().join('/')
          },
        ])

        // Set marking work class
        if (marking.work_class === 'PRODUCTION') {
          await this.waitByElements([{ by: 'css', selector: '#idutbms_classe > option[value="63"]' } ])
          await this.driver.findElement(By.css('#idutbms_classe > option[value="63"]')).click()
        } else {
          await this.waitByElements([{ by: 'css', selector: '#idutbms_classe > option[value="57"]' } ])
          await this.driver.findElement(By.css('#idutbms_classe > option[value="57"]')).click()
        }

        await this.waitByElements([
          { by: 'id', selector: 'narrativa_principal' },
          { by: 'id', selector: 'hora' },
          { by: 'id', selector: 'hora_fim' },
          { by: 'id', selector: 'intervalo_hr_inicial' },
          { by: 'id', selector: 'intervalo_hr_final' },
        ])

        // Set times and description
        await this.fillFormInputElements([
          { by: 'id', selector: 'hora', value: marking.start_time },
          { by: 'id', selector: 'intervalo_hr_inicial', value: marking.start_interval_time ?? '00:00' },
          { by: 'id', selector: 'intervalo_hr_final', value: marking.finish_interval_time ?? '00:00' },
          { by: 'id', selector: 'hora_fim', value: marking.finish_time },
          { by: 'id', selector: 'narrativa_principal', value: marking.description },
        ])

        // Submit form
        await this.driver.findElement(
          By.css('.ui-dialog-buttonset button:nth-child(2)')
        ).click()

        await delay(3000)

        try {
          // The method "getAlertErrors" throw an error if alert does not exists
          markingsResponse.push({
            id: marking.id,
            on_timesheet_id: marking.on_timesheet_id,
            on_timesheet_status: 'SENT',
            timesheet_error: await this.getAlertErrors()
          })

          // Reload window
          await this.driver.get(urls.addMarking({ SHOW: 'list' }))
        } catch {
          // Marking susseffull saved, getting timesheet id
          await this.waitByElements([{ by:'css', selector: 'td > table.list-table > tbody' }])

          markingsResponse.push({
            id: marking.id,
            on_timesheet_id: marking.on_timesheet_id,
            on_timesheet_status: 'SENT',
          })
        }
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
        await this.waitByElements([{ by: 'css', selector: 'td > table.list-table' }])

        // Open marking data modal
        await this.driver.executeScript(`editHora('', '', '', '${marking.on_timesheet_id}', 'T')`)

        // Click on delete button
        await this.waitByElements([{ by: 'css', selector: 'button:nth-child(1)' }])

        await this.driver.findElement(By.css('button:nth-child(1)')).click()

        await this.driver.switchTo().alert().accept()

        await delay(3000)

        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
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
