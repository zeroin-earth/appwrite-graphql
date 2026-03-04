import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateEmailVerification = gql(/* GraphQL */ `
  mutation UpdateEmailVerification($userId: String!, $secret: String!) {
    accountUpdateEmailVerification(userId: $userId, secret: $secret) {
      _id
      userId
      secret
      expire
    }
  }
`)

type Variables = VariablesOf<typeof updateEmailVerification>
type Result = ResultOf<typeof updateEmailVerification>['accountUpdateEmailVerification']

export function useUpdateEmailVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().emailVerification().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateEmailVerification,
        variables: { userId, secret },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateEmailVerification
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
    },
  })

  return { ...queryResult }
}
