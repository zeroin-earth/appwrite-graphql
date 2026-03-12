import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateMagicURLSession = gql(/* GraphQL */ `
  mutation UpdateMagicURLSession($userId: String!, $secret: String!) {
    accountUpdateMagicURLSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof updateMagicURLSession>
type Result = ResultOf<typeof updateMagicURLSession>['accountUpdateMagicURLSession']

export function useUpdateMagicURLSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().magicUrl().update(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: updateMagicURLSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateMagicURLSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  return { ...queryResult }
}
