import { user } from './resolvers/userResolver'
import { users } from './resolvers/usersResolver'
import { createUser } from './resolvers/createUserResolver'
import { updateUser } from './resolvers/updateUserResolver'
import { deleteUser } from './resolvers/deleteUserResolver'
import { loginUser } from './resolvers/loginUserResolver'

export const userResolvers = {
  Query: { user, users },
  Mutation: { createUser, updateUser, deleteUser, loginUser },
}
