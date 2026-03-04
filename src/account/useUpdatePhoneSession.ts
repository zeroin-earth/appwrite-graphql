import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updatePhoneSession = gql(/* GraphQL */ `
  mutation UpdatePhoneSession($userId: String!, $secret: String!) {
    accountUpdatePhoneSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof updatePhoneSession>
type Result = ResultOf<typeof updatePhoneSession>['accountUpdatePhoneSession']

export function useUpdatePhoneSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().phoneToken().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updatePhoneSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdatePhoneSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  return { ...queryResult }
}
