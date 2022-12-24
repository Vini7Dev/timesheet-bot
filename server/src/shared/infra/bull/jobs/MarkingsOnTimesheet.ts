import { JOB_MARKINGS_ON_TIMESHEET } from '@utils/constants'

export default {
  key: JOB_MARKINGS_ON_TIMESHEET,
  handle: async ({ data }: any) => {
    console.log('===========> PASSOU AQUI.....', data)
  }
}
