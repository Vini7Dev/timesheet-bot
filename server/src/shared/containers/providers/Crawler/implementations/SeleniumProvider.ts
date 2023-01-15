import { Builder, By, until, WebDriver } from 'selenium-webdriver'
import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import chromedriver from 'chromedriver'

import { formatDateString } from '@utils/formatDateString'
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

interface IWaitForElementLoad {
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
  driverTimeout,
  urls: { timesheetUrls },
} = crawlerConfig

export class SeleniumProvider implements ICrawler {
  private driverStatus: 'OFF' | 'ON'

  private driver: WebDriver

  private driverTimeout: number

  constructor() {
    this.driverStatus = 'OFF'
    this.driverTimeout = driverTimeout

    chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())
  }

  private async init(): Promise<void> {
    this.driver = await new Builder()
      .forBrowser('chrome')
      .withCapabilities(webdriver.Capabilities.chrome())
      .build()

    this.driver.manage().window().setRect(browserWindowRect)

    this.driverStatus = 'ON'
  }

  private async initDriverIfItIsOff(): Promise<void> {
    if (this.driverStatus === 'OFF') {
      await this.init()
    }
  }

  private async waitForElementsLoad(elementsToWait: IWaitForElementLoad[]): Promise<void> {
    const elementPromises: Promise<any>[] = []

    elementsToWait.forEach((elementToWait) => {
      elementPromises.push(
        this.driver.wait(
          until.elementLocated(By[elementToWait.by](elementToWait.selector)),
          this.driverTimeout,
        )
      )
    })

    await Promise.all(elementPromises)
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

  private async getAlertTexts(): Promise<string[]> {
    try {
      const alert = await this.driver.switchTo().alert()
      const alertText = await alert.getText()

      const errorsMessages = alertText.replace(/\n/gi, '').split('-  ')
      errorsMessages.shift()

      await alert.accept()

      return errorsMessages
    } catch (err) {
      return []
    }
  }

  private getEditHoraScript(onTimesheetId?: string): string {
    if (onTimesheetId) {
      return `editHora('', '', '', '${onTimesheetId}', 'T')`
    }

    return 'editHora()'
  }

  public async closeCrawler(): Promise<void> {
    try {
      await this.driver.close()
    } catch (err) {
      console.error(err)
    } finally {
      this.driverStatus = 'OFF'
      this.driver = null as unknown as WebDriver
    }
  }

  public async authenticateOnTimesheet({
    username,
    password,
  }: ITimesheetAuthDTO): Promise<void> {
    await this.initDriverIfItIsOff()

    await this.driver.get(timesheetUrls.login())

    await this.waitForElementsLoad([
      { by: 'id', selector: 'login' },
      { by: 'id', selector: 'password_sem_md5' },
      { by: 'css', selector: '#login_portal > div:nth-child(6) > button' },
    ])

    await this.driver.findElement(By.id('login')).sendKeys(username)
    await this.driver.findElement(By.id('password_sem_md5')).sendKeys(password)
    await this.driver.findElement(By.css('#login_portal > div:nth-child(6) > button')).click()

    await this.waitForElementsLoad([{
      by: 'css', selector: '#main_menu > li:nth-child(5)'
    }])
  }

  public async saveTimesheetTasks({
    markings,
  }: ISaveMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.initDriverIfItIsOff()

    const markingsResponse: IMarkingResponse[] = []

    for(const marking of markings) {
      try {
        await this.driver.get(timesheetUrls.markings({ DATA: marking.date, SHOW: 'list' }))

        await this.waitForElementsLoad([{ by: 'css', selector: 'td > table.list-table' }])

        await this.driver.executeScript(this.getEditHoraScript())

        await this.waitForElementsLoad([
          { by: 'id', selector: 'codcliente_form_lanctos' },
          { by: 'id', selector: 'codprojeto_form_lanctos' },
          { by: 'id', selector: 'f_data_b' }
        ])

        await this.driver.findElement(By.id('codcliente_form_lanctos'))
          .sendKeys(marking.custumer_code.padStart(10, '0'))

        await this.driver.findElement(By.id('codprojeto_form_lanctos'))
          .sendKeys(marking.project_code)

        await this.fillFormInputElements([{
          by: 'id',
          selector: 'f_data_b',
          value: formatDateString({
            date: marking.date,
            fromSeparator: '-',
            toSeparator: '/'
          })
        }])

        if (marking.work_class === 'PRODUCTION') {
          await this.waitForElementsLoad([{
            by: 'css', selector: '#idutbms_classe > option[value="63"]'
          }])

          await this.driver.findElement(
            By.css('#idutbms_classe > option[value="63"]')
          ).click()
        } else {
          await this.waitForElementsLoad([{
            by: 'css', selector: '#idutbms_classe > option[value="57"]'
          }])

          await this.driver.findElement(
            By.css('#idutbms_classe > option[value="57"]')
          ).click()
        }

        await this.waitForElementsLoad([
          { by: 'id', selector: 'narrativa_principal' },
          { by: 'id', selector: 'hora' },
          { by: 'id', selector: 'hora_fim' },
          { by: 'id', selector: 'intervalo_hr_inicial' },
          { by: 'id', selector: 'intervalo_hr_final' },
        ])

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

        const alertErrors = await this.getAlertTexts()

        if (alertErrors.length > 0) {
          markingsResponse.push({
            id: marking.id,
            on_timesheet_status: 'ERROR',
            timesheet_error: alertErrors,
          })

          continue
        }

        await this.waitForElementsLoad([{
          by:'css', selector: 'td > table.list-table > tbody'
        }])

        const tableMarkingsElements = await this.driver.findElements(
          By.css('td > table.list-table > tbody > tr > td')
        )

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
              timesheet_error: [],
            })

            break
          }
        }
      } catch(err: any) {
        markingsResponse.push({
          id: marking.id,
          on_timesheet_status: 'ERROR',
          timesheet_error: [err.message],
        })
      }
    }

    return { markingsResponse }
  }

  public async updateTimesheetTasks({
    markings,
  }: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.initDriverIfItIsOff()

    await this.driver.get(timesheetUrls.markings({ SHOW: 'list' }))

    const markingsResponse: IMarkingResponse[] = []

    for (const marking of markings) {
      try {
        await this.waitForElementsLoad([{ by: 'css', selector: 'td > table.list-table' }])

        await this.driver.executeScript(this.getEditHoraScript(marking.on_timesheet_id))

        await this.waitForElementsLoad([{ by: 'id', selector: 'f_data_b' }])

        await this.fillFormInputElements([
          {
            by: 'id',
            selector: 'f_data_b',
            value: formatDateString({
              date: marking.date,
              fromSeparator: '-',
              toSeparator: '/'
            })
          },
        ])

        if (marking.work_class === 'PRODUCTION') {
          await this.waitForElementsLoad([{
            by: 'css', selector: '#idutbms_classe > option[value="63"]'
          }])

          await this.driver.findElement(
            By.css('#idutbms_classe > option[value="63"]')
          ).click()
        } else {
          await this.waitForElementsLoad([{
            by: 'css', selector: '#idutbms_classe > option[value="57"]'
          }])

          await this.driver.findElement(
            By.css('#idutbms_classe > option[value="57"]')
          ).click()
        }

        await this.waitForElementsLoad([
          { by: 'id', selector: 'narrativa_principal' },
          { by: 'id', selector: 'hora' },
          { by: 'id', selector: 'hora_fim' },
          { by: 'id', selector: 'intervalo_hr_inicial' },
          { by: 'id', selector: 'intervalo_hr_final' },
        ])

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

        const alertErrors = await this.getAlertTexts()

        if (alertErrors.length > 0) {
          markingsResponse.push({
            id: marking.id,
            on_timesheet_id: marking.on_timesheet_id,
            on_timesheet_status: 'ERROR',
            timesheet_error: alertErrors,
          })

          continue
        }

        await this.waitForElementsLoad([{
          by:'css', selector: 'td > table.list-table > tbody'
        }])

        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
          on_timesheet_status: 'SENT',
          timesheet_error: [],
        })
      } catch(err: any) {
        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
          on_timesheet_status: 'ERROR',
          timesheet_error: [err.message],
        })

        await this.driver.get(timesheetUrls.markings({ SHOW: 'list' }))
      }
    }

    return { markingsResponse }
  }

  public async deleteTimesheetTasks({
    markings,
  }: IDeleteMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.initDriverIfItIsOff()

    await this.driver.get(timesheetUrls.markings({ SHOW: 'list' }))

    const markingsResponse: IMarkingResponse[] = []

    for (const marking of markings) {
      try {
        await this.waitForElementsLoad([{ by: 'css', selector: 'td > table.list-table' }])

        await this.driver.executeScript(`editHora('', '', '', '${marking.on_timesheet_id}', 'T')`)

        // Click on delete button
        await this.waitForElementsLoad([{ by: 'css', selector: 'button:nth-child(1)' }])

        await this.driver.findElement(By.css('button:nth-child(1)')).click()

        await this.driver.switchTo().alert().accept()

        await delay(3000)

        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: undefined,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: [],
        })
      } catch(err: any) {
        markingsResponse.push({
          id: marking.id,
          on_timesheet_id: marking.on_timesheet_id,
          on_timesheet_status: 'ERROR',
          timesheet_error: [err.message],
        })

        await this.driver.get(timesheetUrls.markings({ SHOW: 'list' }))
      }
    }

    return { markingsResponse }
  }
}
