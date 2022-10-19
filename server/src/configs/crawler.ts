const BASE_URL = 'https://timesheet.keyrus.com.br'

interface IAddMarkingQuery {
  CMD?: 'listar'
  SHOW?: 'mes'
}

const buildUrlQuery = (queryObj: any) => new URLSearchParams(queryObj)

export const crawlerConfig = {
  urls: {
    login: () => `${BASE_URL}/login.php`,
    addMarking: ({
      CMD = 'listar',
      SHOW = 'mes',
    }: IAddMarkingQuery) => `${BASE_URL}/timesheet/multidados/module/calendario/index.php?${buildUrlQuery({ CMD, SHOW })}`
  },
  browserWindowRect: { height: 1050, width: 1050, x: 10, y: 10 },
}
