import type { ResultOf, VariablesOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
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

/** The variables accepted by the {@link useGetSession} query. */
export type GetSessionVariables = Prettify<VariablesOf<typeof getSession>>
/** The result returned by the {@link useGetSession} query. */
export type GetSessionResult = Prettify<ResultOf<typeof getSession>['accountGetSession']>

/**
 * Fetches a specific session by its ID.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetSession({ sessionId: 'current' })
 * ```
 *
 * **Parameters** ({@link GetSessionVariables}):
 * - `sessionId` — The ID of the session to retrieve (use `'current'` for the active session).
 *
 * @returns A `UseQueryResult` with the requested session ({@link GetSessionResult}).
 */
export function useGetSession({ sessionId }: GetSessionVariables, opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<GetSessionResult, AppwriteException[], GetSessionResult>({
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
    ...opts,
  })

  return queryResult
}
