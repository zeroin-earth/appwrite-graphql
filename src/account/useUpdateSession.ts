import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const updateSession = gql(/* GraphQL */ `
  mutation UpdateSession($sessionId: String!) {
    accountUpdateSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof updateSession>
type Result = ResultOf<typeof updateSession>['accountUpdateSession']

export function useUpdateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().session().update(),
    mutationFn: async ({ sessionId }) => {
      const { data, errors } = await graphql.mutation({
        query: updateSession,
        variables: {
          sessionId,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountUpdateSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  return { ...queryResult }
}
