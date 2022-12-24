import { IAppContext } from '@shared/infra/apollo/context'

interface ISendMarkingsToTimesheetInput {
  data: {
    markingIds: string[]
  }
}

export const sendMarkingsToTimesheet = (
  _: any,
  { data }: ISendMarkingsToTimesheetInput,
  ctx: IAppContext,
) => {
  console.log('====> Marking IDs', data)

  return true
}
