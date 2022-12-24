import { IWSAppContext } from '@shared/infra/apollo/context'
import { TRIGGER_MARKINGS_TO_TIMESHEET } from '@utils/constants'

export const getOnSendMarkingsToTimesheet = () => {
  return {
    subscribe: (
      _: any,
      __: any,
      { pubsub }: IWSAppContext,
    ) => {
      return pubsub.asyncIterator(TRIGGER_MARKINGS_TO_TIMESHEET)
    },
  }
}
