const TIMESHEET_BASE_URL = process.env.TIMESHEET_BASE_URL ?? 'https://timesheet.keyrus.com.br'

interface IAddMarkingQuery {
  CMD?: 'listar'
  SHOW?: 'mes' | 'list'
  DATA?: string
}

const CRAWLER_TIMEOUT_IN_SECONDS = Number(process.env.CRAWLER_TIMEOUT_IN_SECONDS) ?? 30

const buildUrlQuery = (queryObj: any) => new URLSearchParams(queryObj)

export const crawlerConfig = {
  browserWindowRect: { height: 1050, width: 1050, x: 10, y: 10 },
  driverTimeout: CRAWLER_TIMEOUT_IN_SECONDS * 1000,
  urls: {
    timesheetUrls: {
      login: () => `${TIMESHEET_BASE_URL}/login.php`,
      markings: ({
        CMD = 'listar',
        SHOW = 'mes',
        DATA,
      }: IAddMarkingQuery) => `${TIMESHEET_BASE_URL}/timesheet/multidados/module/calendario/index.php?${buildUrlQuery({ CMD, SHOW, DATA })}`
    }
  },
}
