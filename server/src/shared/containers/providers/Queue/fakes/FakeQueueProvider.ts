import { IQueue, IAddQueueProps } from '../models/IQueue'

export class FakeQueueProvider implements IQueue {
  public async add(): Promise<void> {}

  public process(): void {}
}
