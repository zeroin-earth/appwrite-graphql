import type { ResultOf } from 'gql.tada'
import { graphql as gql } from 'gql.tada'

import { Keys } from '../query/Keys'
import type { AppwriteException, Prettify, QueryOptions } from '../types'
import { useAppwrite } from '../useAppwrite'
import { useQuery } from '../useQuery'

const accountGetPrefs = gql(/* GraphQL */ `
  query GetPrefs {
    accountGetPrefs {
      data
    }
  }
`)

/** The result returned by the {@link useGetPrefs} query. */
export type GetPrefsResult = Prettify<ResultOf<typeof accountGetPrefs>['accountGetPrefs']>

/**
 * Fetches the current user's account preferences.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetPrefs()
 * ```
 *
 * @returns A `UseQueryResult` with the user's account preferences ({@link GetPrefsResult}).
 */
export function useGetPrefs(opts: QueryOptions = {}) {
  const { graphql } = useAppwrite()

  const queryResult = useQuery<GetPrefsResult, AppwriteException[], GetPrefsResult>({
    queryKey: Keys.account().prefs().key(),
    queryFn: async () => {
      const { data, errors } = await graphql.query({
        query: accountGetPrefs,
      })

      if (errors) {
        throw errors
      }

      return data.accountGetPrefs
    },
    ...opts,
  })

  return queryResult
}
