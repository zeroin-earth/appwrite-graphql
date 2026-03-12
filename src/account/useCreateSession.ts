import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useMutation } from '../useMutation'
import { useQueryClient } from '../useQueryClient'

const createSession = gql(/* GraphQL */ `
  mutation CreateSession($userId: String!, $secret: String!) {
    accountCreateSession(userId: $userId, secret: $secret) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof createSession>
type Result = ResultOf<typeof createSession>['accountCreateSession']

export function useCreateSession() {
  const { graphql } = useAppwrite()
  const queryClient = useQueryClient()

  const queryResult = useMutation<Result, AppwriteException[], Variables>({
    mutationKey: Keys.account().session().create(),
    mutationFn: async ({ userId, secret }) => {
      const { data, errors } = await graphql.mutation({
        query: createSession,
        variables: {
          userId,
          secret,
        },
      })

      if (errors) {
        throw errors
      }

      return data.accountCreateSession
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Keys.account().key() })
      void queryClient.invalidateQueries({ queryKey: Keys.account().sessions() })
    },
  })

  return { ...queryResult }
}
