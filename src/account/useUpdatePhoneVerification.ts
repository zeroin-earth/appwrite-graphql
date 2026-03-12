import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'

const updatePhoneVerification = gql(/* GraphQL */ `
  mutation UpdatePhoneVerification($userId: String!, $secret: String!) {
    accountUpdatePhoneVerification(userId: $userId, secret: $secret) {
      expire
    }
  }
`)

type Variables = VariablesOf<typeof updatePhoneVerification>
type Result = ResultOf<typeof updatePhoneVerification>['accountUpdatePhoneVerification']

export function useUpdatePhoneVerification() {
  const { graphql } = useAppwrite()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().phoneVerification().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneVerification
    },
  })

  return { ...queryResult }
}
