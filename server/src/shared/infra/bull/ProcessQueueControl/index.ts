import { inject, injectable } from 'tsyringe'

import { pubsub } from '@shared/infra/apollo/context/pubsub'
import { IQueue } from '@shared/containers/providers/Queue/models/IQueue'
import { ICrawler } from '@shared/containers/providers/Crawler/models/ICrawler'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'

@injectable()
export class ProcessQueueControl {
  private providers: object

  constructor (
    @inject('QueueProvider')
    private queueProvider: IQueue,

    @inject('MarkingsRepository')
    markingsRepository: IMarkingsRepository,

    @inject('CrawlerProvider')
    crawlerProvider: ICrawler,
  ) {
    this.providers = {
      markingsRepository,
      crawlerProvider,
    }
  }

  public async execute() {
    this.queueProvider.process({
      providers: this.providers,
      pubsub,
    })
  }
}
