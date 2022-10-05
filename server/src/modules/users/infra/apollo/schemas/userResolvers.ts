import { user } from './resolvers/userResolver'
import { users } from './resolvers/usersResolver'
import { createUser } from './resolvers/createUserResolver'
import { updateUser } from './resolvers/updateUserResolver'
import { deleteUser } from './resolvers/deleteUserResolver'

export const userResolvers = {
  Query: { user, users },
  Mutation: { createUser, updateUser, deleteUser },
}
