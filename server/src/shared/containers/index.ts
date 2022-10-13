import { container } from 'tsyringe'

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { UsersRepository } from '@modules/users/infra/prisma/repositories/UsersRepository'
import { ICustomersRepository } from '@modules/customers/repositories/ICustomersRepository'
import { CustomersRepository } from '@modules/customers/infra/prisma/repositorires/CustomersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectsRepository'
import { ProjectsRepository } from '@modules/projects/infra/prisma/repositories/ProjectsRepository'

import './providers'

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)
container.registerSingleton<ICustomersRepository>('CustomersRepository', CustomersRepository)
container.registerSingleton<IProjectsRepository>('ProjectsRepository', ProjectsRepository)
