import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const getSession = gql(/* GraphQL */ `
  query GetSession($sessionId: String!) {
    accountGetSession(sessionId: $sessionId) {
      userId
      expire
      current
    }
  }
`)

type Variables = VariablesOf<typeof getSession>
type Result = ResultOf<typeof getSession>['accountGetSession']

export function useGetSession({ sessionId }: Variables) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<Result, AppwriteException[], Result>({
    queryKey: Keys.account().session(sessionId).key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: getSession,
        variables: { sessionId },
      })

      if (errors) {
        throw errors
      }

      return data.accountGetSession
    },
  })

  return queryResult
}
