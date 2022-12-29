import Bull, { Queue, QueueOptions } from 'bull'

import * as Jobs from '@jobs/index'
import { AppError } from '@shared/errors/AppError'
import { IQueue, IAddQueueProps, IProcessProps } from '../models/IQueue'

export interface IHandleProps {
  providers: object
  data: object
}

interface IQueueControlAdd {
  bull: Queue
  name: string
  handle: (props: any) => Promise<any>
}

export class BullProvider implements IQueue {
  private queues: IQueueControlAdd[]

  constructor(queueConfig: QueueOptions) {
    this.queues = Object.values(Jobs).map(job => ({
      bull: new Bull(job.key, queueConfig),
      name: job.key,
      handle: job.handle,
    }))
  }

  public async add({ name, data }: IAddQueueProps): Promise<void> {
    const queueToAdd = this.queues.find(queue => queue.name === name)

    if(!queueToAdd) {
      throw new AppError('Queue not found!', 404)
    }

    queueToAdd.bull.add(data)
  }

  public process({ providers }: IProcessProps): void {
    this.queues.forEach(queue => {
      queue.bull.process(async job => {
        queue.handle({
          providers,
          data: job.data
        })
      })

      queue.bull.on('failed', (job, err) => {
        console.log(`===> Job Failed: ${queue.name} | Job Data: ${
          JSON.stringify(job.data, null, 2)
        }`)
        console.error(err)
      })
    })
  }

  public getQueues(): IQueueControlAdd[] {
    return this.queues
  }
}
