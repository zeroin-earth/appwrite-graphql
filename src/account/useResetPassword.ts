import { AppwriteException } from 'appwrite'

import { gql } from '../__generated__'
import { Token } from '../__generated__/graphql'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

type Props = {
  userId: string
  secret: string
  password: string
  confirmPassword: string
}

const updateRecovery = gql(/* GraphQL */ `
  mutation UpdateRecovery(
    $userId: String!
    $secret: String!
    $password: String!
    $passwordAgain: String!
  ) {
    accountUpdateRecovery(
      userId: $userId
      secret: $secret
      password: $password
      passwordAgain: $passwordAgain
    ) {
      expire
    }
  }
`)

export function useResetPassword() {
  const { graphql } = useAppwrite()

  const passwordReset = useMutation<Token, AppwriteException, Props, unknown>({
    mutationFn: async ({ userId, secret, password, confirmPassword }) => {
      const { data, errors } = await graphql.mutation({
        query: updateRecovery,
        variables: {
          userId,
          secret,
          password,
          passwordAgain: confirmPassword,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateRecovery ?? ({} as Token)
    },
  })

  return passwordReset
}
