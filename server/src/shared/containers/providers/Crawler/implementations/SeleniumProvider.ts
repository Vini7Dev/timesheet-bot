import { Builder, By, until, WebDriver } from 'selenium-webdriver'
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

    this.driver = await new Builder().forBrowser('chrome').build()

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

    // Open add marking page
    await this.driver.get(urls.addMarking({}))

    const markingsResponse: IMarkingResponse[] = []
    for(const marking of markings) {
      try {
        // Wait page load
        await this.waitByElements([{
          by: 'css',
          value: '.quadro-table3 .quadro-td3 .list-table tr td div a',
        }])

        // Open modal to add marking
        await this.driver.findElement(
          By.css('.quadro-table3 .quadro-td3 .list-table tr td div a')
        ).click()

        // Select customer
        await this.waitByElements([{ by: 'id', value: 'namecliente_form_lanctos' }])

        await this.driver.findElement(By.id('namecliente_form_lanctos')).click()

        await this.waitByElements([{ by: 'id', value: 'codcliente_form_lanctos' }])

        // Select customer and project
        await this.driver.findElement(By.id('codcliente_form_lanctos')).sendKeys(marking.costumer_code.padStart(10, '0'))
        await this.driver.findElement(By.id('codprojeto_form_lanctos')).sendKeys(marking.project_code)
        await this.driver.findElement(
          By.css('body > div:nth-child(38) > div.ui-widget-header > a')
        ).click()

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
          await this.driver.get(urls.addMarking({}))
        } catch {
          // Marking susseffull saved
          markingsResponse.push({
            id: marking.id,
            on_timesheet_status: 'SENT',
          })
        }
      } catch(err: any) {
        // An error occurred before save marking
        markingsResponse.push({
          id: marking.id,
          on_timesheet_status: 'NOT_SENT',
          timesheet_error: [err.message]
        })

        // Reload window
        await this.driver.get(urls.addMarking({}))
      }
    }

    return { markingsResponse }
  }

  public async updateTimesheetTasks(data: IUpdateMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    await this.stopCrawler()

    throw new Error('Method not implemented.')
  }

  public async deleteTimesheetTasks(data: IDeleteMarkingsDTO): Promise<ICrawlerResponseDTO> {
    await this.checkDriverStatus()

    await this.stopCrawler()

    throw new Error('Method not implemented.')
  }
}
