import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
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

type Variables = VariablesOf<typeof updateRecovery>
type Result = ResultOf<typeof updateRecovery>['accountUpdateRecovery']

export function useResetPassword() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().recovery().update(),
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

      return data.accountUpdateRecovery
    },
  })

  return { ...queryResult }
}
