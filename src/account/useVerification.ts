import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateVerification = gql(/* GraphQL */ `
  mutation UpdateVerification($userId: String!, $secret: String!) {
    accountUpdateVerification(userId: $userId, secret: $secret) {
      secret
      expire
      userId
    }
  }
`)

type Variables = VariablesOf<typeof updateVerification>
type Result = ResultOf<typeof updateVerification>['accountUpdateVerification']

export function useVerification() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().verification().update(),
    mutationFn: async ({ userId, secret }) => {
      if (!userId || !secret) {
        throw new Error('Missing userId or secret')
      }

      const { data, errors } = await graphql.mutation({
        query: updateVerification,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateVerification
    },
    onSuccess: async () => {
      queryClient.setQueryData(Keys.account().key(), null)
    },
  })

  return { ...queryResult }
}
