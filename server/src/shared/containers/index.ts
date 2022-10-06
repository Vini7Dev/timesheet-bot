import { container } from 'tsyringe'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { UsersRepository } from '@modules/users/infra/prisma/repositories/UsersRepository'

import './providers'

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)
