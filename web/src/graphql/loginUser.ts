import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation loginUser($loginUserData: LoginUserInput) {
    loginUser(
      data: $loginUserData
    ) {
      token
      user_id
    }
  }
`
