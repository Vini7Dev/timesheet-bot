import { IPubSub } from '@shared/infra/apollo/models/IPubSub'

export interface IAddQueueProps {
  name: string
  data: object | object[]
}

export interface IProcessProps {
  pubSub: IPubSub
  providers: object
}

export interface IQueue {
  add(data: IAddQueueProps): Promise<void>
  process(props: IProcessProps): void
}
