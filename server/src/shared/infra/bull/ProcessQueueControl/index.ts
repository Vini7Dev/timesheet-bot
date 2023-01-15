import { inject, injectable } from 'tsyringe'

import { IQueue } from '@shared/containers/providers/Queue/models/IQueue'
import { ICrawler } from '@shared/containers/providers/Crawler/models/ICrawler'
import { IMarkingsRepository } from '@modules/markings/repositories/IMarkingsRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { IEncrypt } from '@shared/containers/providers/Encrypt/models/IEncrypt'
import { IPubSub } from '@shared/infra/apollo/models/IPubSub'

@injectable()
export class ProcessQueueControl {
  private pubSub: IPubSub

  private providers: object

  constructor (
    @inject('QueueProvider')
    private queueProvider: IQueue,

    @inject('PubSub')
    pubSub: IPubSub,

    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('MarkingsRepository')
    markingsRepository: IMarkingsRepository,

    @inject('CrawlerProvider')
    crawlerProvider: ICrawler,

    @inject('EncryptProvider')
    encryptProvider: IEncrypt,
  ) {
    this.pubSub = pubSub

    this.providers = {
      usersRepository,
      markingsRepository,
      crawlerProvider,
      encryptProvider,
    }
  }

  public async execute() {
    this.queueProvider.process({
      providers: this.providers,
      pubSub: this.pubSub,
    })
  }
}
