import { gql } from '../__generated__'
import type {
  Token,
  UpdateRecoveryMutation,
  UpdateRecoveryMutationVariables,
} from '../__generated__/graphql'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updateRecovery = gql(/* GraphQL */ `
  mutation UpdateRecovery($userId: String!, $secret: String!, $password: String!) {
    accountUpdateRecovery(userId: $userId, secret: $secret, password: $password) {
      expire
    }
  }
`)

export function useResetPassword() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<
    UpdateRecoveryMutation['accountUpdateRecovery'],
    AppwriteException[],
    UpdateRecoveryMutationVariables
  >({
    mutationFn: async ({ userId, secret, password }) => {
      const { data, errors } = await graphql.mutation({
        query: updateRecovery,
        variables: {
          userId,
          secret,
          password,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateRecovery ?? ({} as Token)
    },
  })

  return { ...queryResult }
}
