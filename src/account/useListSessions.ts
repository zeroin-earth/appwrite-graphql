import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountListSessions = gql(/* GraphQL */ `
  query ListSessions {
    accountListSessions {
      sessions {
        _id
        _createdAt
        osName
        clientName
      }
    }
  }
`)

/** The result returned by the {@link useListSessions} query. */
export type ListSessionsResult = Prettify<
  ResultOf<typeof accountListSessions>['accountListSessions']
>

/**
 * Fetches all active sessions for the current user.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useListSessions()
 * ```
 *
 * @returns A `UseQueryResult` with the user's active sessions ({@link ListSessionsResult}).
 */
export function useListSessions(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<ListSessionsResult, AppwriteException[], ListSessionsResult>({
    queryKey: Keys.account().sessions(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountListSessions,
      })

      if (errors) {
        throw errors
      }

      return data.accountListSessions
    },
    ...opts,
  })

  return queryResult
}
