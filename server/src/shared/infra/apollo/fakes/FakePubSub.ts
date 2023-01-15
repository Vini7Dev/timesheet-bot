import { IPubSub } from '../models/IPubSub'

interface IPublishItemProps {
  key: string
  payload: any
}

export class FakePubSub implements IPubSub {
  private publishList: IPublishItemProps[] = []

  public async publish<Payload extends object>(key: string, payload: Payload): Promise<void> {
    this.publishList.push({
      key,
      payload
    })
  }

  public asyncIterator(_key: string): AsyncIterator<any, any, undefined> {
    return {
      next: () => new Promise(() => {}),
      return: () => new Promise(() => {}),
      throw: () => new Promise(() => {})
    }
  }
}
